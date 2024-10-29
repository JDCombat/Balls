import { Color } from "./Colors"
const ctx = document.querySelector("canvas")!.getContext("2d")!

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
        ctx.clearRect(this.x*size+2, this.y*size+2, size -4, size - 4)
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x*size + (size/2), this.y*size + (size / 2), size/2 - 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    enlarge(size:number){
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x*size + (size/2), this.y*size + (size / 2), size/2 - 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    clear(size:number){
        ctx.clearRect(this.x*size+2, this.y*size+2, size -4, size - 4)
    }
    // move(x:number, y:number){
    //     this.x = x
    //     this.y = y
    // }
}