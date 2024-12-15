import { Color } from "./Colors"
import Game from "./Game"
/**
 * Variable containing a canvas drawing context
 */
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
    /**
     * A method rendering the ball object on the canvas
     * @param size Size of the ball to render
     */
    render(size:number){
        ctx.clearRect(this.x*size+2, this.y*size+2, size -4, size - 4)
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x*size + (size/2), this.y*size + (size / 2), size/2 - 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    /**
     * A method to enlarge selected ball on the canvas
     * @param size Base size of the ball
     */
    enlarge(size:number){
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x*size + (size/2), this.y*size + (size / 2), size/2 - 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    /**
     * A method for clearing the ball on the canvas
     * @param size Size of the ball to render
     */
    clear(size:number){
        ctx.clearRect(this.x*size+2, this.y*size+2, size -4, size - 4)
    }
    /**
     * A method for moving the ball to new x,y coordinates
     * @param x A new x coordinate
     * @param y A new y coordinate
     */
    move(x:number, y:number){
        if(x<0){x=0}
        if(y<0){y=0}
        if(x>8){x=8}
        if(y>8){y=8}
        this.x = x
        this.y = y
    }
    drawPath(x:number, y:number){
        ctx.beginPath()
        ctx.lineWidth = 64
        ctx.moveTo(this.x*64, this.y*64)
        ctx.lineTo(x,y)
        ctx.stroke()
    }
}