import Ball from "./Ball";
import Grid from "./Grid";

export default class Game{
    constructor(){}

    balls: Ball[] = []

    canvas: HTMLCanvasElement = document.querySelector("canvas")!

    size: number = 64

    playfield: Grid = new Grid(9)



    startGame(){
        const ball = new Ball(0, 0, "cornflowerblue")
        this.playfield.grid[0][0] = ball
        this.balls.push(ball)
        this.render()
        this.canvas.addEventListener("click", this.click)
    }
    render(){
        const ctx = this.canvas.getContext("2d")!
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.playfield.render()
        this.balls.forEach(e => {
            e.render(this.size)
        });
    }

    click(e: MouseEvent){
        console.log(Math.floor(e.offsetX / 64), Math.floor(e.offsetY/64));
        const cellX = Math.floor(e.offsetX / this.size)
        const cellY = Math.floor(e.offsetY / this.size)
    }
        
}