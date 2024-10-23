import Ball from "./Ball";
import Grid from "./Grid";

export default class Game{
    constructor(){}

    balls: Ball[] = []

    canvas: HTMLCanvasElement = document.querySelector("canvas")!

    size: number = 32

    grid: Grid = new Grid(9)

    startGame(){
        this.render()
    }
    render(){
        const ctx = this.canvas.getContext("2d")!
        this.grid.grid.forEach(row =>{
            row.forEach(e =>{
                ctx.strokeRect(e.x, e.y, e.x*this.size, e.y*this.size)
            })
        })
    }
}