import {vec3, vec4, mat4, quat} from 'gl-matrix';

function degToRad(deg: number) {
    return deg * Math.PI / 180.0;
}

export default class Turtle {
    position : vec3;
    forward: vec4;
    right: vec4;
    up: vec4;
    pathLength: number;
    depth: number;
    radius: number;
    deg: number;

    constructor(pos: vec3, forward: vec4, right: vec4, up: vec4, depth: number, pathLength: number, radius: number) {
        this.position = pos;
        this.forward = forward;
        this.right = right;
        this.up = up;
        this.depth = depth;
        this.pathLength = pathLength;
        this.radius = radius;
        this.deg = 20.0 + Math.random() * 30.0;
    }

    moveForward() {
        let dir = vec3.fromValues(this.forward[0], this.forward[1], this.forward[2]);
        let dist = vec3.fromValues(dir[0] * this.pathLength, dir[1] * this.pathLength, dir[2] * this.pathLength);
        vec3.add(this.position, this.position, dist);
    }

    rotateForwardPos() {
        let rotMat = mat4.create();
        let rad = degToRad(this.deg);
        let axis = vec3.fromValues(this.forward[0], this.forward[1], this.forward[2]);
        mat4.fromRotation(rotMat, rad, axis);
        vec4.normalize(this.right, vec4.transformMat4(this.right, this.right, rotMat));
        vec4.normalize(this.up, vec4.transformMat4(this.up, this.up, rotMat));
    }

    rotateForwardNeg() {
        let rotMat = mat4.create();
        let rad = degToRad(-1.0 * this.deg);
        let axis = vec3.fromValues(this.forward[0], this.forward[1], this.forward[2]);
        mat4.fromRotation(rotMat, rad, axis);
        vec4.normalize(this.right, vec4.transformMat4(this.right, this.right, rotMat));
        vec4.normalize(this.up, vec4.transformMat4(this.up, this.up, rotMat));
    }

    rotateRightPos() {
        let rotMat = mat4.create();
        let rad = degToRad(this.deg);
        let axis = vec3.fromValues(this.right[0], this.right[1], this.right[2]);
        mat4.fromRotation(rotMat, rad, axis);
        vec4.normalize(this.forward, vec4.transformMat4(this.forward, this.forward, rotMat));
        vec4.normalize(this.up, vec4.transformMat4(this.up, this.up, rotMat));
    }

    rotateRightNeg() {
        let rotMat = mat4.create();
        let rad = degToRad(-1.0 * this.deg);
        let axis = vec3.fromValues(this.right[0], this.right[1], this.right[2]);
        mat4.fromRotation(rotMat, rad, axis);
        vec4.normalize(this.forward, vec4.transformMat4(this.forward, this.forward, rotMat));
        vec4.normalize(this.up, vec4.transformMat4(this.up, this.up, rotMat));
    }

    rotateUpPos() {
        let rotMat = mat4.create();
        let rad = degToRad(this.deg);
        let axis = vec3.fromValues(this.up[0], this.up[1], this.up[2]);
        mat4.fromRotation(rotMat, rad, axis);
        vec4.normalize(this.forward, vec4.transformMat4(this.forward, this.forward, rotMat));
        vec4.normalize(this.right, vec4.transformMat4(this.right, this.right, rotMat));
    }

    rotateUpNeg() {
        let rotMat = mat4.create();
        let rad = degToRad(-1.0 * this.deg);
        let axis = vec3.fromValues(this.up[0], this.up[1], this.up[2]);
        mat4.fromRotation(rotMat, rad, axis);
        vec4.normalize(this.forward, vec4.transformMat4(this.forward, this.forward, rotMat));
        vec4.normalize(this.right, vec4.transformMat4(this.right, this.right, rotMat));
    }

    increaseDepth() {
        this.depth = this.depth + 1;
    }

    deepCopy() {
        let copy = new Turtle(vec3.fromValues(0, 0, 0), vec4.fromValues(0, 0, 0, 0), 
                              vec4.fromValues(0, 0, 0, 0), vec4.fromValues(0, 0, 0, 0), 
                              0, 0, 0);
        copy.position = vec3.clone(this.position);
        copy.forward = vec4.clone(this.forward);
        copy.right = vec4.clone(this.right);
        copy.up = vec4.clone(this.up);
        copy.depth = this.depth;
        copy.pathLength = this.pathLength;
        copy.radius = this.radius;
        return copy;
    }

    getTransformationMat() {
        let transformation = mat4.create();
        let rotation = mat4.create();

        mat4.set(rotation, this.right[0], this.right[1], this.right[2], 0, 
                           this.up[0], this.up[1], this.up[2], 0,
                           this.forward[0], this.forward[1], this.forward[2], 0,
                           0, 0, 0, 1);

        let translation = mat4.create();
        mat4.fromTranslation(translation, this.position);

        let scale = mat4.create();
        mat4.fromScaling(scale, vec3.fromValues(this.radius / this.depth, 1, this.radius / this.depth));

        mat4.multiply(transformation, rotation, translation);
        mat4.multiply(transformation, transformation, scale);
        return transformation;
    }

}