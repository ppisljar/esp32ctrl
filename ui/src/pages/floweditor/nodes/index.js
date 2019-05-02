import { setStateNode } from "./actions/set_state";
import { ifElseNode } from "./logic/if_else";
import { timerNode } from "./triggers/timer";
import { eventNode } from "./triggers/event";
import { clockNode } from "./triggers/clock";
import { bootNode } from "./triggers/boot";
import { hwtimerNode } from "./triggers/hw_timer";
import { hwinterruptNode } from "./triggers/hw_interrupt";
import { touchNode } from "./triggers/touch";
import { bluetoothNode } from "./triggers/bluetooth";
import { alexaNode } from "./triggers/alexa";
import { delayNode } from "./logic/delay";
import { mqttNode } from "./actions/mqtt";
import { httpNode } from "./actions/http";
import { fireeventNode } from "./actions/fire_event";
import { settimerNode } from "./actions/set_timer";
import { getStateNode } from "./actions/get_state";
import { setHwTimerNode } from "./actions/set_hw_timer";
import { mathNode } from "./logic/math";

export const nodes = [
    timerNode, hwtimerNode, hwinterruptNode, touchNode, bluetoothNode, alexaNode,
    eventNode, clockNode, bootNode, 
    ifElseNode, delayNode, mathNode, 
    getStateNode, setStateNode, fireeventNode, settimerNode, setHwTimerNode,mqttNode, httpNode

];