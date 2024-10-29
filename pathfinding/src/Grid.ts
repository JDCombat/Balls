import Ball from "./Ball";

export default class Grid{
    grid: Ball[][] =[]

    constructor(size:number){
        this.grid = Array.from(Array(size), () => Array(size).fill(""))
    }
    render(){
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