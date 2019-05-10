/******************************************************************************

                              Online C++ Compiler.
               Code, Compile, Run and Debug C++ program online.
Write your code in this editor and press "Run" button to compile and execute it.

*******************************************************************************/

#include <iostream>
#include <cstring>
#include <stdlib.h>

using namespace std;

enum Type { integer, decimal, string };

// gets a pointer, type of variable at pointer, pointer to source and type of source
// template is used so we get correct destination pointer in (instead of void*) and
// type conversions (float to int) works correctly
template <typename T>
void convert(T ptr, Type to, void* val, Type from) {
    if (to != Type::string) {
        if (from == Type::string) {
            double d = atof((const char *)val);
            *ptr = d;
        } else if (to == Type::integer) {
            *ptr = *(int*)val;
        } else if (to == Type::decimal) {
            *ptr = *(float*)val;
        }
    } else {
        if (from == Type::string) {
            strcpy((char*)ptr, (const char*)val);   // this is a problem, we don't know the maximum size of destination string here
        } else if (from == Type::integer) {
            //itoa(*(int*)val, (char*)ptr, 10);
        } else if (from == Type::decimal) {
           // dtoa(*(float*)val, (char*)ptr, 10);   
        }
    }
}

class Plugin1 {
    private:
      int state1;
      float state2;
      char state3[20];
      Type state1_t = Type::integer;
      Type state2_t = Type::decimal;
      Type state3_t = Type::string;
      
    public:
        Plugin1();
        
        void* getState(int, Type*);
        void setState(int, void*, Type);

};

Plugin1::Plugin1() {
    state1 = 5;         // inside plugin we need direct access to variables as we need it to be fast
    state2 = 3.14;      // also plugin author is aware of the types of his states
    strncpy(state3, "hello world", 20);
}

// for externally getting access to the state
// this can be slower (but not too slow)
// we need to tell type of state as well, as outside of the plugin we have no knowledge of state type
// n: state number
void* Plugin1::getState(int n, Type* t) {
    if (n == 0) { *t = state1_t; return &state1; }
    else if (n == 1) { *t = state2_t; return &state2; }
    else if (n == 2) { *t = state3_t; return &state3; }
    else return nullptr;
}

void Plugin1::setState(int n, void* val, Type t) {
    if (n == 0) convert(&state1, state1_t, val, t);
    else if (n == 1) convert(&state2, state2_t, val, t);
    else if (n == 2) convert(state3, state3_t, val, t);     // having state3 being a pointer already will prevent me from wrting macros to generte this code
}

int main()
{
    Plugin1* p1_1 = new Plugin1(); // 5, 3.14, "hello world"
    Plugin1* p1_2 = new Plugin1();

    void* state_ptr;
    Type state_type;
    
    // set plugin state
    p1_2->setState(0, (void*)"3.14", Type::string);
    p1_2->setState(1, (void*)"3.14", Type::string);
    p1_2->setState(2, (void*)"3.14", Type::string);

    float f1 = 3.14;
    p1_2->setState(0, (void*)&f1, Type::decimal);

    // read state from one plugin, of one type and store it to a different plugin
    // plugin will try to convert the value to its own internal type when storing
    state_ptr = p1_1->getState(0, &state_type); // int 5
    p1_2->setState(1, state_ptr, state_type);   // should convert int 5 to float 5

    // read state from plugin to use here
    state_ptr = p1_2->getState(1, &state_type);
    float f2 = 0;
    convert(&f2, Type::decimal, state_ptr, state_type); // f2 should be 5 here, its not

    cout << f1 << "\n" << f2 << "\n";

    return 0;
}
