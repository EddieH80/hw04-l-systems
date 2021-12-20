import {vec3, vec4, mat4} from 'gl-matrix';
import Turtle from './Turtle';

export default class ExpansionRule {
    grammarX: Map<string, string> = new Map();
    grammarY: Map<string, string> = new Map();
    grammarZ: Map<string, string> = new Map();

    constructor() {
        this.grammarX.set("F", "FF");
        this.grammarX.set("X", "F[1FX]2FX");

        this.grammarY.set("F", "FF");
        this.grammarY.set("X", "F[3FX]4FX");

        this.grammarZ.set("F", "FF");
        this.grammarZ.set("X", "F[5FX]6FX");
    }

    expand(axiom: string, iterations: number) {
        let out = axiom;
        for (let i = 0; i < iterations; i++) {
            let temp = "";
            for (let j = 0; j < out.length; j++) {
                // Non-deterministically expand string, varying rotations along axes
                if (out.charAt(j) == 'F' || out.charAt(j) == 'X') {
                    let t = Math.random();
                    if (t < 0.33) {
                        temp += this.grammarX.get(out.charAt(j));
                    } else if (t < 0.67) {
                        temp += this.grammarY.get(out.charAt(j));
                    } else {
                        temp += this.grammarZ.get(out.charAt(j));
                    }
                } else {
                    temp += out.charAt(j);
                }
            }
            out = temp;
        }
        console.log(out);
        return out;
    }
}