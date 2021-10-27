import {vec3, vec4, mat4} from 'gl-matrix';
import Turtle from './Turtle';

export default class LSystemGenerator {
    grammar: Map<string, string> = new Map();

    constructor() {
        this.grammar.set("F", "FF");
        this.grammar.set("X", "F[+X]-FX")
    }

    generate(axiom: string, iterations: number) {
        let out = axiom;
        for (let i = 0; i < iterations; i++) {
            let temp = "";
            for (let j = 0; j < out.length; i++) {
                // Map current character to expanded string
                temp += this.grammar.get(out.charAt(j));
            }
            out = temp;
        }
        return out;
    }
}