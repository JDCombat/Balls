import { IColor, Color } from "./IColor"
import Game from "./Game"
import { Point } from "./IPoint"
/**
 * Variable containing a canvas drawing context
 */
const ctx = document.querySelector("canvas")!.getContext("2d")!

/**
 * @module Ball
 * A class representing a ball object
 */
export default class Ball{
    /** A position of ball */
    public pos: Point
    /** A color of the ball */
    public color: IColor
    /** A boolean value indicating if the ball is large (selected) */
    public large?: boolean
    /** A boolean value indicating if the ball can be moved */
    public canMove: boolean = true

    /**
     * A constructor creating a new ball object
     * @param x X coordinate of the ball
     * @param y Y coordinate of the ball
     * @param color Color of the ball
     */
    public constructor(x:number, y:number, color: Color){
        this.pos = {x: x, y: y}
        this.color = {color: color}
    }
    /**
     * A method rendering the ball object on the canvas
     * @param size Size of the ball to render
     */
    public render(size:number){
        // ctx.clearRect(this.pos.x*size+2, this.pos.y*size+2, size -4, size - 4)
        if(this.large){
            this.enlarge(size)
            return
        }
        ctx.beginPath()
        ctx.fillStyle = this.color.color
        ctx.arc(this.pos.x*size + (size/2), this.pos.y*size + (size / 2), size/2 - 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    /**
     * A method to enlarge selected ball on the canvas
     * @param size Base size of the ball
     */
    public enlarge(size:number){
        ctx.beginPath()
        ctx.fillStyle = this.color.color
        ctx.arc(this.pos.x*size + (size/2), this.pos.y*size + (size / 2), size/2 - 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    /**
     * A method for clearing the ball on the canvas
     * @param size Size of the ball to render
     */
    public clear(size:number){
        ctx.clearRect(this.pos.x*size+2, this.pos.y*size+2, size -4, size - 4)
    }
    /**
     * A method for moving the ball to new x,y coordinates
     * @param x A new x coordinate
     * @param y A new y coordinate
     */
    public move(x:number, y:number){
        if(x<0){x=0}
        if(y<0){y=0}
        if(x>8){x=8}
        if(y>8){y=8}
        Game.playfield.grid[this.pos.y][this.pos.x] = null
        this.pos.x = x
        this.pos.y = y
        Game.playfield.grid[this.pos.y][this.pos.x] = this
    }
}