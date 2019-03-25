#ifndef Espalexa_h
#define Espalexa_h

/*
 * Alexa Voice On/Off/Brightness/Color Control. Emulates a Philips Hue bridge to Alexa.
 * 
 * This was put together from these two excellent projects:
 * https://github.com/kakopappa/arduino-esp8266-alexa-wemo-switch
 * https://github.com/probonopd/ESP8266HueEmulator
 */

#ifndef ESPALEXA_MAXDEVICES
 #define ESPALEXA_MAXDEVICES 10 //this limit only has memory reasons, set it higher should you need to
#endif

#include <sys/param.h>
#include "esp_http_server.h"
#include "udp_server.h"
#include "espalexadevice.h"


class Espalexa {
private:

  uint8_t currentDeviceCount = 0;
  bool discoverable = true;

  EspalexaDevice* devices[ESPALEXA_MAXDEVICES] = {};
  //Keep in mind that Device IDs go from 1 to DEVICES, cpp arrays from 0 to DEVICES-1!!
  
  WiFiUDP espalexaUdp;
  in_addr_t ipMulti;
  in_addr_t local_ip;
  bool udpConnected = false;
  char packetBuffer[255]; //buffer to hold incoming udp packet
  std::string escapedMac=""; //lowercase mac address
  std::string macAddress="";
  
  //private member functions
  std::string boolString(bool st)
  {
    return(st)?"true":"false";
  }
  
  std::string modeString(EspalexaColorMode m)
  {
    if (m == EspalexaColorMode::xy) return "xy";
    if (m == EspalexaColorMode::hs) return "hs";
    return "ct";
  }
  
  std::string typeString(EspalexaDeviceType t)
  {
    switch (t)
    {
      case EspalexaDeviceType::dimmable:      return "Dimmable light";
      case EspalexaDeviceType::whitespectrum: return "Color temperature light";
      case EspalexaDeviceType::color:         return "Color light";
      case EspalexaDeviceType::extendedcolor: return "Extended color light";
      default: return "Light";
    }
    return "Light";
  }
  
  std::string modelidString(EspalexaDeviceType t)
  {
    switch (t)
    {
      case EspalexaDeviceType::dimmable:      return "LWB010";
      case EspalexaDeviceType::whitespectrum: return "LWT010";
      case EspalexaDeviceType::color:         return "LST001";
      case EspalexaDeviceType::extendedcolor: return "LCT015";
      default: return "Plug 01";
    }
    return "Plug 01";
  }
  
  //device JSON std::string: color+temperature device emulates LCT015, dimmable device LWB010, (TODO: on/off Plug 01, color temperature device LWT010, color device LST001)
  std::string deviceJsonString(uint8_t deviceId)
  {
    if (deviceId < 1 || deviceId > currentDeviceCount) return "{}"; //error
    EspalexaDevice* dev = devices[deviceId-1];

    std::string json("{\"state\":{\"on\":");
    json += boolString(dev->getValue());
    if (dev->getType() != EspalexaDeviceType::onoff) //bri support
    {
      json += ",\"bri\":" + std::to_string(dev->getLastValue()-1);
      if (static_cast<uint8_t>(dev->getType()) > 2) //color support
      {
        json += ",\"hue\":" + std::to_string(dev->getHue()) + ",\"sat\":" + std::to_string(dev->getSat());
        json += ",\"effect\":\"none\",\"xy\":[" + std::to_string(dev->getX()) + "," + std::to_string(dev->getY()) + "]";
      }
      if (static_cast<uint8_t>(dev->getType()) > 1 && dev->getType() != EspalexaDeviceType::color) //white spectrum support
      {
        json += ",\"ct\":" + std::to_string(dev->getCt());
      }
    }
    json += ",\"alert\":\"none";
    if (static_cast<uint8_t>(dev->getType()) > 1) json += "\",\"colormode\":\"" + modeString(dev->getColorMode());
    json += "\",\"mode\":\"homeautomation\",\"reachable\":true},";
    json += "\"type\":\"" + typeString(dev->getType());
    json += "\",\"name\":\"" + dev->getName();
    json += "\",\"modelid\":\"" + modelidString(dev->getType());
    json += "\",\"manufacturername\":\"Espalexa\",\"productname\":\"E" + std::to_string(static_cast<uint8_t>(dev->getType()));
    json += "\",\"uniqueid\":\""+ macAddress +"-"+ std::to_string(deviceId+1);
    json += "\",\"swversion\":\"2.4.0\"}";
    
    return json;
  }

  //respond to UDP SSDP M-SEARCH
  void respondToSearch()
  {
    char* s = inet_ntoa(local_ip);
    std::string myip(s);

    std::string response = 
      "HTTP/1.1 200 OK\r\n"
      "EXT:\r\n"
      "CACHE-CONTROL: max-age=100\r\n" // SSDP_INTERVAL
      "LOCATION: http://"+ myip +":80/description.xml\r\n"
      "SERVER: FreeRTOS/6.0.5, UPnP/1.0, IpBridge/1.17.0\r\n" // _modelName, _modelNumber
      "hue-bridgeid: "+ escapedMac +"\r\n"
      "ST: urn:schemas-upnp-org:device:basic:1\r\n"  // _deviceType
      "USN: uuid:2f402f80-da50-11e1-9b23-"+ escapedMac +"::upnp:rootdevice\r\n" // _uuid::_deviceType
      "\r\n";

    in_addr_t ip = espalexaUdp.remoteIP();
    ESP_LOGI("ALEXA", "sending search response to %s:%d", inet_ntoa(ip), espalexaUdp.remotePort());
    ESP_LOGI("ALEXA", "%s", response.c_str());

    espalexaUdp.beginPacket(espalexaUdp.remoteIP(), espalexaUdp.remotePort());
    espalexaUdp.write((uint8_t*)response.c_str(), response.length());
    espalexaUdp.endPacket();                    
  }

public:
  Espalexa(){}

  //initialize interfaces
  bool begin(in_addr_t myip)
  {
      local_ip = myip;
    ESP_LOGI("ALEXA","Espalexa Begin... %s", inet_ntoa(local_ip));
    ESP_LOGI("ALEXA","MAXDEVICES %d", ESPALEXA_MAXDEVICES);

    uint8_t mac[6];
    esp_read_mac(mac, (esp_mac_type_t)0);
    char buff[32];
    sprintf(buff, "%x:%x:%x:%x:%x:%x", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    macAddress = buff;
    ESP_LOGI("ALEXA", "MAC: %s", macAddress.c_str());
    sprintf(buff, "%x%x%x%x%x%x", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    escapedMac = buff;// todo: tolower
    struct in_addr ip;
    inet_aton("239.255.255.250", &ip);

    udpConnected = espalexaUdp.beginMulticast(ip.s_addr, 1900);


    if (udpConnected){
      // ? register handler
      ESP_LOGI("ALEXA","UDP Server started");
      return true;
    }
    ESP_LOGI("ALEXA","Failed");
    return false;
  }

  //send description.xml device property page
  esp_err_t serveDescription(httpd_req_t *req)
  {
    ESP_LOGI("ALEXA","# Responding to description.xml ... #\n");
    char* s = inet_ntoa(local_ip);

    httpd_resp_set_status(req, "200 OK");
    httpd_resp_sendstr_chunk(req, "<?xml version=\"1.0\" ?>"
        "<root xmlns=\"urn:schemas-upnp-org:device-1-0\">"
        "<specVersion><major>1</major><minor>0</minor></specVersion>"
        "<URLBase>http://");
        
    httpd_resp_sendstr_chunk(req, s);
    httpd_resp_sendstr_chunk(req, ":80/</URLBase>"
        "<device>"
          "<deviceType>urn:schemas-upnp-org:device:Basic:1</deviceType>"
          "<friendlyName>Espalexa (");
    httpd_resp_sendstr_chunk(req, s);
    httpd_resp_sendstr_chunk(req, ")</friendlyName>"
          "<manufacturer>Royal Philips Electronics</manufacturer>"
          "<manufacturerURL>http://www.philips.com</manufacturerURL>"
          "<modelDescription>Philips hue Personal Wireless Lighting</modelDescription>"
          "<modelName>Philips hue bridge 2012</modelName>"
          "<modelNumber>929000226503</modelNumber>"
          "<modelURL>http://www.meethue.com</modelURL>"
          "<serialNumber>");
    httpd_resp_sendstr_chunk(req, escapedMac.c_str());
    httpd_resp_sendstr_chunk(req, "</serialNumber>"
          "<UDN>uuid:2f402f80-da50-11e1-9b23-");
    httpd_resp_sendstr_chunk(req, escapedMac.c_str());
    httpd_resp_sendstr_chunk(req, "</UDN>"
          "<presentationURL>index.html</presentationURL>"
          "<iconList>"
          "  <icon>"
          "    <mimetype>image/png</mimetype>"
          "    <height>48</height>"
          "    <width>48</width>"
          "    <depth>24</depth>"
          "    <url>hue_logo_0.png</url>"
          "  </icon>"
          "</iconList>"
        "</device>"
        "</root>");
          
    
    httpd_resp_sendstr_chunk(req, NULL);
    return ESP_OK;
  }

  //service loop
  void loop() {
    
    if (!udpConnected) {
        ESP_LOGE("ALEXA", "udp not connected!");
        return;   
    }
    int packetSize = espalexaUdp.parsePacket();    
    if (!packetSize) { //espalexaUdp.available()) {
        return; //no new udp packet
    }
    
    ESP_LOGD("ALEXA","Got UDP!");
    int len = espalexaUdp.read(packetBuffer, 254);
    if (len > 0) {
      packetBuffer[len] = 0;
    }
    espalexaUdp.flush();
    if (!discoverable) return; //do not reply to M-SEARCH if not discoverable
    
    std::string request = packetBuffer;
    if(request.find("M-SEARCH") != std::string::npos) {
      ESP_LOGD("ALEXA","%s", request.c_str());
      if(request.find("upnp:rootdevice") != std::string::npos ||  request.find("asic:1") != std::string::npos) {
        ESP_LOGI("ALEXA","Responding search req...");
        respondToSearch();
      }
    }
  }

  bool addDevice(EspalexaDevice* d)
  {
    ESP_LOGI("ALEXA","Adding device %d", (currentDeviceCount+1));
    if (currentDeviceCount >= ESPALEXA_MAXDEVICES) return false;
    if (d == nullptr) return false;
    d->setId(currentDeviceCount);
    devices[currentDeviceCount] = d;
    currentDeviceCount++;
    return true;
  }

  bool addDevice(std::string deviceName, std::function<void(void*, uint8_t)> callback, EspalexaDeviceType t = EspalexaDeviceType::dimmable, uint8_t initialValue = 0)
  {
    ESP_LOGI("ALEXA","%d",(currentDeviceCount+1));
    if (currentDeviceCount >= ESPALEXA_MAXDEVICES) return false;
    EspalexaDevice* d = new EspalexaDevice(deviceName, callback, t, initialValue);
    return addDevice(d);
  }

  void httpSend(httpd_req_t *req, uint8_t code, char* type, char* body) {
    if (code == 200) httpd_resp_set_status(req, "200 OK");

    httpd_resp_set_type(req, type);
    httpd_resp_sendstr(req, body);
  }
  
  //basic implementation of Philips hue api functions needed for basic Alexa control
  esp_err_t handleAlexaApiCall(httpd_req_t *r)
  { 

    std::string req(r->uri);
    char buf[255];
    int len = r->content_len;
    httpd_req_recv(r, buf, MIN(len, 255));
    std::string body(buf);

    
    if (req.find("api") == std::string::npos) return false; //return if not an API call

    ESP_LOGI("ALEXA","AlexaApiCall %s\n %s", req.c_str(), body.c_str());
    ESP_LOGI("ALEXA","ok");

    if (body.find("devicetype") != std::string::npos) //client wants a hue api username, we dont care and give static
    {
      ESP_LOGI("ALEXA","devType");
      body = "";
      httpSend(r, 200, "application/json", "[{\"success\":{\"username\":\"2WLEDHardQrI3WHYTHoMcXHgEspsM8ZZRpSKtBQr\"}}]");
      return true;
    }

    if (req.find("state") != std::string::npos) //client wants to control light
    {
      httpSend(r, 200, "application/json", "[{\"success\":true}]"); //short valid response

      int devId = std::stoi(req.substr(req.find("lights")+7));
      ESP_LOGI("ALEXA","ls %d", devId);
      devices[devId-1]->setPropertyChanged(EspalexaDeviceProperty::none);
      
      if (body.find("false") != std::string::npos) //OFF command
      {
        devices[devId-1]->setValue(0);
        devices[devId-1]->setPropertyChanged(EspalexaDeviceProperty::off);
        devices[devId-1]->doCallback();
        return true;
      }
      
      if (body.find("true") != std::string::npos) //ON command
      {
        devices[devId-1]->setValue(devices[devId-1]->getLastValue());
        devices[devId-1]->setPropertyChanged(EspalexaDeviceProperty::on);
      }
      
      if (body.find("bri") != std::string::npos) //BRIGHTNESS command
      {
        uint8_t briL = std::stoi(body.substr(body.find("bri") +5));
        if (briL == 255)
        {
         devices[devId-1]->setValue(255);
        } else {
         devices[devId-1]->setValue(briL+1); 
        }
        devices[devId-1]->setPropertyChanged(EspalexaDeviceProperty::bri);
      }
      
      if (body.find("xy")  != std::string::npos) //COLOR command (XY mode)
      {
        devices[devId-1]->setColorXY(std::stof(body.substr(body.find("[") +1)), std::stof(body.substr(body.find(",0") +1)));
        devices[devId-1]->setPropertyChanged(EspalexaDeviceProperty::xy);
      }
      
      if (body.find("hue") != std::string::npos) //COLOR command (HS mode)
      {
        devices[devId-1]->setColor(std::stoi(body.substr(body.find("hue") +5)), std::stoi(body.substr(body.find("sat") +5)));
        devices[devId-1]->setPropertyChanged(EspalexaDeviceProperty::hs);
      }
      
      if (body.find("ct") != std::string::npos) //COLOR TEMP command (white spectrum)
      {
        devices[devId-1]->setColor(std::stoi(body.substr(body.find("ct") +4)));
        devices[devId-1]->setPropertyChanged(EspalexaDeviceProperty::ct);
      }
      
      devices[devId-1]->doCallback();
      
      return true;
    }
    
    int pos = req.find("lights");
    if (pos > 0) //client wants light info
    {
      
      int devId = 0;
      if (req.length() > pos + 7) {
          devId = std::stoi(req.substr(pos + 7, 1));
      }
      ESP_LOGI("ALEXA","l %d",devId);

      if (devId == 0) //client wants all lights
      {
        ESP_LOGI("ALEXA","lAll");
        std::string jsonTemp = "{";
        for (int i = 0; i<currentDeviceCount; i++)
        {
          jsonTemp += "\"" + std::to_string(i+1) + "\":";
          jsonTemp += deviceJsonString(i+1);
          if (i < currentDeviceCount-1) jsonTemp += ",";
        }
        jsonTemp += "}";
        ESP_LOGI("ALEXA", "responding with: \n %s", jsonTemp.c_str());
        httpSend(r, 200, "application/json", (char*)jsonTemp.c_str());
      } else //client wants one light (devId)
      {
        httpSend(r, 200, "application/json", (char*)deviceJsonString(devId).c_str());
      }
      
      return true;
    }

    //we dont care about other api commands at this time and send empty JSON
    httpSend(r, 200, "application/json", "{}");
    return true;
  }
  
  //set whether Alexa can discover any devices
  void setDiscoverable(bool d)
  {
    discoverable = d;
  }
  
  //get EspalexaDevice at specific index
  EspalexaDevice* getDevice(uint8_t index)
  {
    if (index >= currentDeviceCount) return nullptr;
    return devices[index];
  }
  
  //is an unique device ID
  std::string getEscapedMac()
  {
    return escapedMac;
  }
  
  ~Espalexa(){delete devices;} //note: Espalexa is NOT meant to be destructed
};

#endif