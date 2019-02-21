
// class SwitchPlugin {
//     private:
//         int gpio = 255;
//     public:
//         SwitchPlugin();
//         void init() {
//             // initializes the connection and registers additional pins
//             // marks pins its using as blocked
//         }
//         void destroy() {
//             // unregisters additional pins and frees blocked pins
//         }
//         void getVars() {
//             // returns { pin1: 0, pin2: 0, pin3: 1 ... }
//         }
//         void getConfig() {
//             // returns (reference?) { i2c_port: 1, i2c_address: 255, type: DHT11, interval: 60 }
//         }
// } 