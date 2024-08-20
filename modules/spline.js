export default class Spline {
    // A utility function to interpolate between points using Catmull-Rom spline
    static catmullRomSpline(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;

        const tension = 1

        const x = 0.5 * (
            (2 * p1.x) +
            (-p0.x + p2.x) * t * tension + // Apply tension here
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3 * tension // And here
        );
    
        const y = 0.5 * (
            (2 * p1.y) +
            (-p0.y + p2.y) * t * tension + // Apply tension here
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3 * tension // And here
        );

        return { x, y };
    }

    // Generate spline points for all control points
    static generateSplinePoints(controlPoints, segments) {
        const splinePoints = [];
        
        if (controlPoints.length < 4) {
            throw new Error("At least 4 control points are required.");
        }

        // Loop through each segment of 4 points
        for (let i = 0; i < controlPoints.length - 3; i++) {
            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                
                const pt = this.catmullRomSpline(
                    controlPoints[i],
                    controlPoints[i + 1],
                    controlPoints[i + 2],
                    controlPoints[i + 3],
                    t
                );
                splinePoints.push(pt);
            }
        }

        return splinePoints;
    }
}