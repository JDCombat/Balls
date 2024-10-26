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
    render(size:number){
        const ctx = document.querySelector("canvas")!.getContext("2d")!
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x + (size/2), this.y + (size / 2), size/2 - 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}