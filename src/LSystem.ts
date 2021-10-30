import {vec3, vec4, mat4} from 'gl-matrix';
import Turtle from './Turtle';
import ExpansionRule from './ExpansionRule';
import DrawingRule from './DrawingRule';

export default class LSystem {
    axiom: string;
    iterations: number;
    expander: ExpansionRule;
    drawer: DrawingRule;

    constructor(axiom: string, iterations: number) {
        this.axiom = axiom;
        this.iterations = iterations;
        this.expander = new ExpansionRule();
        this.drawer = new DrawingRule();
    }

    iterate() {
        this.drawer.draw(this.expander.expand(this.axiom, this.iterations));
    }

}