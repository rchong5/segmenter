import { Pt } from "../models/core.js"





export function calcArea(points: Pt[]): number
{ 
    // use the shoelace formula to calculate the area of a polygon

    let sum: number = 0;
    let area: number = 0;

    if(points.length > 3)
    {
        for (let i = 0; i < points.length; i++)
        {
            const j = (i + 1) % points.length;
            sum += points[i].x * points[j].y;
            sum -= points[j].x * points[i].y;
        }

        area = Math.abs(sum) / 2;
    }
    else if(points.length == 3) // use the triangle area formula
    {
        sum = (points[0].x * (points[1].y - points[2].y)) + (points[1].x * (points[2].y - points[0].y)) + (points[2].x * (points[0].y - points[1].y));
        area = Math.abs(sum) / 2;
    }
    // else, not enough points to calculate area

    return(area);
}