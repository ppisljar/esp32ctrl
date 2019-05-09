

// gets state variable, it can be:
// bit, byte, int16, uin16, int32, uint32, float, double, string
auto var = p1->getStatePtr(0); 


// sets state variable of another plugin, it can be of any type
// how to convert signed->unsigned and vice versa ? don't do anything ?
// if bigger var, we can loose precision
// if smaller we need to make sure we don't just overread memory
// from double/float to int -> round
// from string to number: try to parse
// from number to string: convert
p1->setStatePtr(1, var);

enum v_type : unsigned char {bit, byte, int16, uin16, int32, uint32, float, double, string};

struct value_t {
    void* data;
    v_type type;
}

class P {
    private:

        uint32_t prop1;
        
        value_t prop1_v = {
            data: &prop1,
            v_type: v_type.uint32
        };

        value_t prop2 = {
            data: nullptr,
            v_type: v_type.byte
        };
    public:
        void setStatePtr(int, value_t);
        value_t getStatePtr(int);
}

value_t p::getStatePtr(int val) {
    if (val == 0) return prop1;
    else if (val == 1) return prop2;
}

void p::setStatePtr(int val, value_t val) {
    if (val == 0) set_value(prop1, val);
    else if (val == 1) set_value(prop2, val);
}


------ templates ?

template <typename T> 
T getState(int val) {
    if (val == 0) return val1;
}

template <typename T>
void setState(int val, T value) {
    if (val == 0) set_val(&val1, &value); // where set_val is overloaded function accepting all kind of parameter combinations.

}

template <typename T> 
T* getStatePtr(int val) {
    if (val == 0) return val1;
}

template <typename T>
void setStatePtr(int val, T* value) {
    if (val == 0) set_val(&val1, value); // where set_val is overloaded function accepting all kind of parameter combinations.
}


------- overloaded function ?