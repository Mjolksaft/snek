export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(v1, v2) {
        return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
    }

    static angle(v1, v2) {
        return Math.atan2(v2.y - v1.y, v2.x - v1.x);
    }

    static fromAngle(angle, length) {
        return new Vector(length * Math.cos(angle), length * Math.sin(angle));
    }
}
