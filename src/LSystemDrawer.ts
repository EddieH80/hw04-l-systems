import {vec3, vec4, mat4} from 'gl-matrix';
import Turtle from './Turtle';

export default class LSystemDrawer {
    drawRules: Map<string, any> = new Map;
    turtleStack: Turtle[] = []
    turtle: Turtle;
    branchTransformations: mat4[] = [];
    leaveTransformations: mat4[] = [];

    constructor() {
        this.drawRules.set("F", this.turtle.moveForward.bind(this.turtle));
    }

    draw(seq : string) {
        for (let i = 0; i < seq.length; i++) {
            let char = seq.charAt(i);
            let func = this.drawRules.get(char);
            if (func) {
                func();
            }
            // Push transformation for F and reduce branch radius


        }
    }
}