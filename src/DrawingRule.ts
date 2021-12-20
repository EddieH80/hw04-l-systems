import {vec3, vec4, mat4} from 'gl-matrix';
import Turtle from './Turtle';

export default class DrawingRule {
    drawRules: Map<string, any> = new Map();
    turtleStack: Array<Turtle> = new Array();
    turtle: Turtle;
    branchTransformations: mat4[] = [];
    leafTransformations: mat4[] = [];

    constructor() {
        this.turtle = new Turtle(vec3.fromValues(0, 0, 0), vec4.fromValues(0, 1, 0, 0),
        vec4.fromValues(1, 0, 0, 0), vec4.fromValues(0, 0, 1, 0), 1, 1, 30);
        this.drawRules.set("F", this.turtle.moveForward.bind(this.turtle));
        this.drawRules.set("1", this.turtle.rotateForwardPos.bind(this.turtle));
        this.drawRules.set("2", this.turtle.rotateForwardNeg.bind(this.turtle));
        this.drawRules.set("3", this.turtle.rotateRightPos.bind(this.turtle));
        this.drawRules.set("4", this.turtle.rotateRightNeg.bind(this.turtle));
        this.drawRules.set("5", this.turtle.rotateUpPos.bind(this.turtle));
        this.drawRules.set("6", this.turtle.rotateUpNeg.bind(this.turtle));
        this.drawRules.set("[", this.pushTurtle.bind(this, this.turtle));
        this.drawRules.set("]", this.popTurtle.bind(this));
    }

    draw(seq : string) {
        for (let i = 0; i < seq.length; i++) {
            let char = seq.charAt(i);
            let func = this.drawRules.get(char);
            if (func) {
                func();
            }
            if (char == 'F') {
                this.turtle.radius = Math.max(0.2, 0.85 * this.turtle.radius);
                this.branchTransformations.push(this.turtle.getTransformationMat());
            }
            if (char == 'L') {
                this.leafTransformations.push(this.turtle.getTransformationMat());
            }
            // Push transformation for F and reduce branch radius
            // if (char == '[') {
            //     this.turtleStack.push(this.turtle);
            // }
            // if (char == ']') {
            //     this.turtle = this.turtleStack.pop();
            // }
        }
    }

    pushTurtle(turtle: Turtle) {
        this.turtleStack.push(turtle.deepCopy());
    }

    popTurtle() {
        this.turtle = this.turtleStack.pop().deepCopy();
    }
}