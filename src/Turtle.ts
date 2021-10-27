import {vec3, vec4, mat4} from 'gl-matrix';

export default class Turtle {
    position : vec3;
    orientation: vec3;
    radius: number;

    constructor(pos: vec3, orient: vec3, radius: number) {
        this.position = pos;
        this.orientation = orient;
        this.radius = radius;
    }

    moveForward() {
        vec3.add(this.position, this.position, this.orientation);
    }

    rotatePosX() {
        // Rotate by random number in [20, 50]
        let deg = 20.0 + 30.0 * Math.random();
        let rotateMat = mat4.create();
        mat4.fromXRotation(rotateMat, deg);
        let orient = vec4.fromValues(this.orientation[0], this.orientation[1], this.orientation[2], 0.0);
    }
}