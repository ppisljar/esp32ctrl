/******************************************************************************

                              Online C++ Compiler.
               Code, Compile, Run and Debug C++ program online.
Write your code in this editor and press "Run" button to compile and execute it.

*******************************************************************************/

#include <iostream>
#include <cstring>
#include <stdlib.h>

using namespace std;





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
        
        

};



// for externally getting access to the state
// this can be slower (but not too slow)
// we need to tell type of state as well, as outside of the plugin we have no knowledge of state type
// n: state number
void* Plugin1::getState(int n, Type* t = nullptr) {
    if (n == 0) { if (t != nullptr) *t = state1_t; return &state1; }
    else if (n == 1) { if (t != nullptr) *t = state2_t; return &state2; }
    else if (n == 2) { if (t != nullptr) *t = state3_t; return &state3[0]; }
    else return nullptr;
}

void Plugin1::setState(int n, void* val, Type t) {
    if (n == 0) convert(&state1, state1_t, val, t);
    else if (n == 1) convert(&state2, state2_t, val, t);
    else if (n == 2) convert(&state3[0], state3_t, val, t);     // having state3 being a pointer already will prevent me from wrting macros to generte this code
}

int main()
{
    float ft = 3.14;
    int it = 5;
    float* ftp = &ft;
    int* itp = &it;
    float ftp2 = *itp;
    int itp2 = *ftp;
    printf("float converted to int: %d\nint converted to float: %f\n\n", itp2, ftp2);

    Plugin1* p1_1 = new Plugin1(); // 5, 3.14, "hello world"
    Plugin1* p1_2 = new Plugin1();

    void* state_ptr;
    Type state_type;
    
    // set plugin state
    p1_2->setState(0, (void*)"3.14", Type::string);
    p1_2->setState(1, (void*)"3.14", Type::string);
    p1_2->setState(2, (void*)"3.14", Type::string);

    printf("\n\ninital state for p1 and state from strings for p2\n");
    printf("p1 state1: %d, state2: %f, state3: %s\n", *(int*)p1_1->getState(0), *(float*)p1_1->getState(1), (char*)p1_1->getState(2));
    printf("p2 state1: %d, state2: %f, state3: %s\n", *(int*)p1_2->getState(0), *(float*)p1_2->getState(1), (char*)p1_2->getState(2));

    float f1 = 5.14;
    p1_1->setState(1, (void*)&f1, Type::decimal);
    p1_2->setState(0, (void*)&f1, Type::decimal);

    int i1 = 3;
    p1_1->setState(0, (void*)&i1, Type::integer);
    p1_2->setState(1, (void*)&i1, Type::integer);

    printf("\n\np1: same type state update, p2: diff type state update\n");
    printf("p1 state1: %d, state2: %f, state3: %s\n", *(int*)p1_1->getState(0), *(float*)p1_1->getState(1), (char*)p1_1->getState(2));
    printf("p2 state1: %d, state2: %f, state3: %s\n", *(int*)p1_2->getState(0), *(float*)p1_2->getState(1), (char*)p1_2->getState(2));

    // read state from one plugin, of one type and store it to a different plugin
    // plugin will try to convert the value to its own internal type when storing
    state_ptr = p1_1->getState(0, &state_type); 
    p1_2->setState(0, state_ptr, state_type);   

    state_ptr = p1_1->getState(1, &state_type); 
    p1_2->setState(1, state_ptr, state_type);   

    printf("\n\np2 updated from p1\n");
    printf("p1 state1: %d, state2: %f, state3: %s\n", *(int*)p1_1->getState(0), *(float*)p1_1->getState(1), (char*)p1_1->getState(2));
    printf("p2 state1: %d, state2: %f, state3: %s\n", *(int*)p1_2->getState(0), *(float*)p1_2->getState(1), (char*)p1_2->getState(2));

    state_ptr = p1_1->getState(0, &state_type); 
    p1_2->setState(1, state_ptr, state_type);  

    state_ptr = p1_1->getState(1, &state_type); 
    p1_2->setState(0, state_ptr, state_type);   

    printf("\n\np2 updated from p1 but with diff type\n");
    printf("p1 state1: %d, state2: %f, state3: %s\n", *(int*)p1_1->getState(0), *(float*)p1_1->getState(1), (char*)p1_1->getState(2));
    printf("p2 state1: %d, state2: %f, state3: %s\n", *(int*)p1_2->getState(0), *(float*)p1_2->getState(1), (char*)p1_2->getState(2));

    // read state from plugin to use here
    state_ptr = p1_2->getState(1, &state_type);
    float f2 = 0;
    convert(&f2, Type::decimal, state_ptr, state_type); 

    // read and convert state from plugin
    float f3 = p1_2->getState(0, Type::decimal);

    cout << f1 << "\n" << f2 << "\n";

    return 0;
}
