import Ball from "./Ball";

/**
 * @module Grid
 * A class representing a grid of balls
 */
export default class Grid{
    /**A matrix containing balls */
    grid: Ball[][] =[]

    /**
     * A constructor creating a new grid object
     * @param size Size of the grid
     */
    public constructor(size:number){
        this.grid = Array.from(Array(size), () => Array(size).fill(undefined))
    }
    /**
     * A method for rendering the grid on the canvas
     */
    public render(){
        const ctx = document.querySelector("canvas")!.getContext("2d")!
        ctx.strokeStyle = "black"
        for(let i = 0; i < 576; i+=64){
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.moveTo(i, 0)
            ctx.lineTo(i, 576)
            ctx.stroke()
            ctx.closePath()
            for(let j = 0; j < 576; j+=64){
                ctx.beginPath()
                ctx.moveTo(0, j)
                ctx.lineTo(576, j)
                ctx.stroke()
                ctx.closePath()
            }
        }
    }
}