import {vec3, vec4, mat4} from 'gl-matrix';
import Turtle from './Turtle';
import LSystemGenerator from './LSystemGenerator';
import LSystemDrawer from './LSystemDrawer';

export default class LSystem {
    axiom: string;
    iterations: number;
    generator: LSystemGenerator;
    drawer: LSystemDrawer;

    constructor(axiom: string, iterations: number) {
        this.axiom = axiom;
        this.iterations = iterations
        this.generator = new LSystemGenerator();
        this.drawer = new LSystemDrawer();
    }

    iterate() {
        this.drawer.draw(this.generator.generate(this.axiom, this.iterations));
    }

}