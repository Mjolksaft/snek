export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(v1, v2) {
        
        return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
    }

    static angle(v1, v2) {

        return Math.atan2(v1.y - v2.y, v1.x - v2.x);
    }

    static fromAngle(angle, length) {
        return new Vector(length * Math.cos(angle), length * Math.sin(angle));
    }

    static sub(v0, v1) {
        return new Vector(v0.x - v1.x, v0.y - v1.y);
    }

    static add(v0, v1) {
        return new Vector(v0.x + v1.x, v0.y + v1.y);
    }

    static norm(v) {
        let mag = Math.sqrt(v.x ** 2 + v.y ** 2)
        return new Vector(v.x / mag, v.y / mag);
    }

    static scale(v, s) {
        return new Vector(v.x * s, v.y * s);
    }

    static lerp(start, end, t) {
        return Vector.add(Vector.scale(start, 1 - t), Vector.scale(end, t));
    }
}