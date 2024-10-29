import Ball from "./Ball";
import { randomize } from "./Colors";
import Grid from "./Grid";

let selected: Ball | null

export default class Game{
    constructor(){}

    balls: Ball[] = []

    canvas: HTMLCanvasElement = document.querySelector("canvas")!

    size: number = 64

    playfield: Grid = new Grid(9)



    startGame(){
        this.randomBalls()
        this.render()
        this.canvas.addEventListener("click", this.click.bind(this))
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

        console.log(selected);
        

        if(this.balls.find(e=>e.x==cellX && e.y==cellY)){
            if(selected){
                selected.render(this.size)
            }
            selected = this.balls.find(e=>e.x==cellX && e.y==cellY)!
            selected.enlarge(this.size)
        }
            // selected.clear(this.size)
            // selected.move(cellX, cellY)
            // selected.render(this.size)




        

    }
    randomBalls(){
        for(let i = 0; i < 3; i++){
            const randX = Math.floor(Math.random()*9)
            const randY = Math.floor(Math.random()*9)
            if(this.balls.find(e=>e.x == randX && e.y == randY)){
                i--
                continue
            }
            const ball = new Ball(randX, randY, randomize())
            ball.render(this.size)
            this.playfield.grid[randY][randX] = ball
            this.balls.push(ball)
        }
        console.table(this.playfield.grid);
        console.log(this.balls);
        
        
    }
        
}