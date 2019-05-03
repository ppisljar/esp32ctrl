#include "DNSServer.h"
#include <lwip/def.h>

bool string_to_lower1(std::string& subject) {
    for (auto& c : subject) {
        c = std::tolower(c);
    }
    return true;
}

bool replace_string_in_place1(std::string& subject, const std::string& search, const std::string& replace) {
    size_t pos = 0;
    bool success = false;
    while((pos = subject.find(search, pos)) != std::string::npos) {
         subject.replace(pos, search.length(), replace);
         pos += replace.length();
         success = true;
    }
    return success;
}

void downcaseAndRemoveWwwPrefix(char *domainName)
{
  //for (int i = 0; i < strlen(domainName); i++) domainName[i] = tolower(domainName[i]);
  //str_replace(domainName, "www.", "");
}

DNSServer::DNSServer()
{
  _ttl = htonl(DNS_DEFAULT_TTL);
  _errorReplyCode = DNSReplyCode::NonExistentDomain;
  _dnsHeader    = (DNSHeader*) malloc( sizeof(DNSHeader) ) ;
  _dnsQuestion  = (DNSQuestion*) malloc( sizeof(DNSQuestion) ) ;     
  _buffer     = NULL;
  _currentPacketSize = 0;
  _port = 0;
}

bool DNSServer::start(const uint16_t &port, const char* domainName,
                     in_addr_t *resolvedIP)
{
  _port = port;
  _buffer = NULL;
  _domainName = (char*)domainName;
  _resolvedIP[0] = ((uint8_t*)resolvedIP)[0];
  _resolvedIP[1] = ((uint8_t*)resolvedIP)[1];
  _resolvedIP[2] = ((uint8_t*)resolvedIP)[2];
  _resolvedIP[3] = ((uint8_t*)resolvedIP)[3];
  downcaseAndRemoveWwwPrefix(_domainName);

  ESP_LOGI("DNS", "starting dns server");
  xTaskCreatePinnedToCore(this->task, "DNS", 4096, this, 5, &task_h, 1);

  return _udp.begin(_port) == 1;
}

void DNSServer::setErrorReplyCode(const DNSReplyCode &replyCode)
{
  _errorReplyCode = replyCode;
}

void DNSServer::setTTL(const uint32_t &ttl)
{
  _ttl = htonl(ttl);
}

void DNSServer::stop()
{
  vTaskDelete(task_h);
  _udp.stop();
  free(_buffer);
  _buffer = NULL;
}

void DNSServer::task(void * pvParameters)
{
    DNSServer* s = (DNSServer*)pvParameters;

    //ESP_LOGI(P002_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        s->processNextRequest();
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

bool replace(std::string& str, const std::string& from, const std::string& to) {
    size_t start_pos = str.find(from);
    if(start_pos == std::string::npos)
        return false;
    str.replace(start_pos, from.length(), to);
    return true;
}

void DNSServer::processNextRequest()
{
  _currentPacketSize = _udp.parsePacket();
  if (_currentPacketSize)
  {
    // Allocate buffer for the DNS query
    if (_buffer != NULL) 
      free(_buffer);
    _buffer = (unsigned char*)malloc(_currentPacketSize * sizeof(char));
    if (_buffer == NULL) 
      return;

    // Put the packet received in the buffer and get DNS header (beginning of message)
    // and the question
    _udp.read(_buffer, _currentPacketSize);
    memcpy( _dnsHeader, _buffer, DNS_HEADER_SIZE ) ; 
    if ( requestIncludesOnlyOneQuestion() )
    {
      // The QName has a variable length, maximum 255 bytes and is comprised of multiple labels.
      // Each label contains a byte to describe its length and the label itself. The list of 
      // labels terminates with a zero-valued byte. In "github.com", we have two labels "github" & "com"
      // Iterate through the labels and copy them as they come into a single buffer (for simplicity's sake)
      _dnsQuestion->QNameLength = 0 ;
      while ( _buffer[ DNS_HEADER_SIZE + _dnsQuestion->QNameLength ] != 0 )
      {
        memcpy( (void*) &_dnsQuestion->QName[_dnsQuestion->QNameLength], (void*) &_buffer[DNS_HEADER_SIZE + _dnsQuestion->QNameLength], _buffer[DNS_HEADER_SIZE + _dnsQuestion->QNameLength] + 1 ) ;
        _dnsQuestion->QNameLength += _buffer[DNS_HEADER_SIZE + _dnsQuestion->QNameLength] + 1 ; 
      }
      _dnsQuestion->QName[_dnsQuestion->QNameLength] = 0 ; 
      _dnsQuestion->QNameLength++ ;   

      // Copy the QType and QClass 
      memcpy( &_dnsQuestion->QType, (void*) &_buffer[DNS_HEADER_SIZE + _dnsQuestion->QNameLength], sizeof(_dnsQuestion->QType) ) ;
      memcpy( &_dnsQuestion->QClass, (void*) &_buffer[DNS_HEADER_SIZE + _dnsQuestion->QNameLength + sizeof(_dnsQuestion->QType)], sizeof(_dnsQuestion->QClass) ) ;
    }
    

    if (_dnsHeader->QR == DNS_QR_QUERY &&
        _dnsHeader->OPCode == DNS_OPCODE_QUERY &&
        requestIncludesOnlyOneQuestion() &&
        (strcmp(_domainName, "*") == 0 || strcmp(getDomainNameWithoutWwwPrefix(), _domainName) == 0)
       )
    {
      replyWithIP();
    }
    else if (_dnsHeader->QR == DNS_QR_QUERY)
    {
      replyWithCustomCode();
    }

    free(_buffer);
    _buffer = NULL;
  }
}

bool DNSServer::requestIncludesOnlyOneQuestion()
{
  return ntohs(_dnsHeader->QDCount) == 1 &&
         _dnsHeader->ANCount == 0 &&
         _dnsHeader->NSCount == 0 &&
         _dnsHeader->ARCount == 0;
}


const char* DNSServer::getDomainNameWithoutWwwPrefix()
{
  // Error checking : if the buffer containing the DNS request is a null pointer, return an empty domain
  std::string parsedDomainName = "";
  if (_buffer == NULL) 
    return parsedDomainName.c_str();
  
  // Set the start of the domain just after the header (12 bytes). If equal to null character, return an empty domain
  unsigned char *start = _buffer + DNS_OFFSET_DOMAIN_NAME;
  if (*start == 0)
  {
    return parsedDomainName.c_str();
  }

  int pos = 0;
  while(true)
  {
    unsigned char labelLength = *(start + pos);
    for(int i = 0; i < labelLength; i++)
    {
      pos++;
      parsedDomainName += (char)*(start + pos);
    }
    pos++;
    if (*(start + pos) == 0)
    {
      string_to_lower1(parsedDomainName);
      replace_string_in_place1(parsedDomainName, "www.", "");
      return parsedDomainName.c_str();
    }
    else
    {
      parsedDomainName += ".";
    }
  }
}

void DNSServer::replyWithIP()
{
  if (_buffer == NULL) return;
  
  _udp.beginPacket(_udp.remoteIP(), _udp.remotePort());
  
  // Change the type of message to a response and set the number of answers equal to 
  // the number of questions in the header
  _dnsHeader->QR      = DNS_QR_RESPONSE;
  _dnsHeader->ANCount = _dnsHeader->QDCount;
  _udp.write( (unsigned char*) _dnsHeader, DNS_HEADER_SIZE ) ;

  // Write the question
  _udp.write(_dnsQuestion->QName, _dnsQuestion->QNameLength) ;
  _udp.write( (unsigned char*) &_dnsQuestion->QType, 2 ) ;
  _udp.write( (unsigned char*) &_dnsQuestion->QClass, 2 ) ;

  // Write the answer 
  // Use DNS name compression : instead of repeating the name in this RNAME occurence,
  // set the two MSB of the byte corresponding normally to the length to 1. The following
  // 14 bits must be used to specify the offset of the domain name in the message 
  // (<255 here so the first byte has the 6 LSB at 0) 
  _udp.write((uint8_t) 0xC0); 
  _udp.write((uint8_t) DNS_OFFSET_DOMAIN_NAME);  

  // DNS type A : host address, DNS class IN for INternet, returning an IPv4 address 
  uint16_t answerType = htons(DNS_TYPE_A), answerClass = htons(DNS_CLASS_IN), answerIPv4 = htons(DNS_RDLENGTH_IPV4)  ; 
  _udp.write((unsigned char*) &answerType, 2 );
  _udp.write((unsigned char*) &answerClass, 2 );
  _udp.write((unsigned char*) &_ttl, 4);        // DNS Time To Live
  _udp.write((unsigned char*) &answerIPv4, 2 );
  _udp.write(_resolvedIP, sizeof(_resolvedIP)); // The IP address to return
  _udp.endPacket();
}

void DNSServer::replyWithCustomCode()
{
  if (_buffer == NULL) return;
  _dnsHeader->QR = DNS_QR_RESPONSE;
  _dnsHeader->RCode = (unsigned char)_errorReplyCode;
  _dnsHeader->QDCount = 0;

  _udp.beginPacket(_udp.remoteIP(), _udp.remotePort());
  _udp.write(_buffer, sizeof(DNSHeader));
  _udp.endPacket();
}
