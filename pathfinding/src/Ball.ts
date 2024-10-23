import { Color } from "./Colors"

export default class Ball{
    x: number
    y: number
    color: Color

    constructor(x:number, y:number, color: Color){
        this.x = x
        this.y = y
        this.color = color
    }
}