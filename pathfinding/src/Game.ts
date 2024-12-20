import Ball from "./Ball";
import { IColor, randomizeColor } from "./IColor";
import Grid from "./Grid";
import IGame from "./IGame";
import { Point } from "./IPoint";

/**
 * A variable containing currently selected ball
 */
let selected: Ball | null

/**
 * @module Game
 * A class representing a game
 */
export default class Game implements IGame{
    public constructor(){}

    /**An array of existing balls */
    public balls: Ball[] = []

    /** Holds the canvas HTML element */
    readonly canvas: HTMLCanvasElement = document.querySelector("canvas")!

    /** Size of ball (in px) */
    private size: number = 64

    /** A playfield matrix */
    static playfield: Grid = new Grid(9)

    /** An array containing a preview of colors for next round */
    private nextColors: IColor[] = []

    /** A variable containing current score */
    public score: number = 0

    /** A variable containing best score */
    public bestScore: number = Number(localStorage.getItem("best")) ?? 0

    /** A variable containing current path */
    private currentPath: Point[]

    /** A variable containing a preview of colors divs */
    private previewArr: NodeListOf<HTMLDivElement> = document.querySelectorAll("#preview > div")

    /** A variable containing a disabled state of the game */
    private disabled: boolean = false

    /** A variable containing a start time of the game */
    private startTime: Date = new Date()


    /**
     * Starting game method
     */
    public startGame(){
        this.randomBalls()
        this.render()
        this.canvas.addEventListener("click", this.click.bind(this))
        this.canvas.addEventListener("mousemove", this.move.bind(this))
        this.previewColors()
        this.updateScores()
    }
    /**
     * A method for rendering the grid
     */
    private render(){
        const ctx = this.canvas.getContext("2d")!
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        Game.playfield.render()

        this.balls.forEach(e => {
            e.render(this.size)
        });
    }

    /**
     * A method for click handling
     * @param e A mouse event object
     */
    private click(e: MouseEvent){
        if(this.disabled){
            return
        }
        this.checkGame()
        console.log(Math.floor(e.offsetX / 64), Math.floor(e.offsetY/64));
        const cellX = Math.floor(e.offsetX / this.size)
        const cellY = Math.floor(e.offsetY / this.size)

        console.log(selected);
        
        const newSelect = this.balls.find(e=>e.pos.x==cellX && e.pos.y==cellY)

        if(newSelect && !newSelect.canMove){
            return
        }

        if(newSelect){
            if(selected == newSelect){
                selected.large = false
                selected.clear(this.size)
                selected.render(this.size)
                selected = null
                return
            }
            if(selected){
                selected.large = false
                selected.clear(this.size)
                selected.render(this.size)
            }
            selected = newSelect
            selected.large = true
            selected.enlarge(this.size)
        }
        else if(selected){
            if(!this.currentPath){
                return
            }
            const ctx = this.canvas.getContext("2d")
            selected.clear(this.size)
            ctx.fillStyle = "rgba(255,0,0,0.4)"
            ctx.fillRect(selected.pos.x*this.size,selected.pos.y*this.size,this.size,this.size)
            selected.move(cellX, cellY)
            selected.large = false
            selected.render(this.size)
            selected = null

            this.disabled = true
            setTimeout(() => {
                let points = this.checkBallCrossings()
                this.score += points
                if(points === 0){
                    this.randomBalls(this.nextColors)
                    this.checkBallCrossings()
                    this.previewColors()
                }
                this.updateScores()

                this.currentPath = null
                this.render()
                this.disabled = false
                this.canMove()
                this.checkGame()
            }, 500);
        }
    }

    /**
     * A method for handling mouse move event
     * @param e A mouse event object
     */
    private move(e: MouseEvent){
        const cellX = Math.floor(e.offsetX / this.size)
        const cellY = Math.floor(e.offsetY / this.size)

        if(selected){
            let start: Point = {x:selected.pos.x, y:selected.pos.y}
            let end: Point = {x:cellX, y:cellY}
            
            this.currentPath = this.bfsPathfinding(start,end);

            this.render()
            if(this.currentPath && this.currentPath.length > 1){
                this.currentPath.forEach(e=>{
                const ctx = this.canvas.getContext("2d")!
                ctx.fillStyle = "rgba(255,0,0,0.4)"
                if(e.x == start.x && e.y == start.y){
                    selected.clear(this.size)
                    ctx.fillRect(e.x*this.size+2,e.y*this.size+2,this.size - 4,this.size - 4)
                    selected.render(this.size)
                    return
                }
                ctx.fillRect(e.x*this.size+2,e.y*this.size+2,this.size - 4,this.size - 4)
                })
            }
        }
    }

    /**
     * Generates balls on random locations with random colors
     *  @param color If not null an array of colors to generate new balls with
     */
    private randomBalls(color?: IColor[]){
        for(let i = 0; i < 3; i++){
            const randX = Math.floor(Math.random()*Game.playfield.grid.length)
            const randY = Math.floor(Math.random()*Game.playfield.grid.length)
            if(this.balls.find(e=>e.pos.x == randX && e.pos.y == randY)){
                i--
                continue
            }
            const ball = new Ball(randX, randY, color ? color[i].color : randomizeColor())
            ball.render(this.size)
            Game.playfield.grid[randY][randX] = ball
            this.balls.push(ball)
        }
        console.log(Game.playfield.grid);
        console.log(this.balls);
        
        
    }
    /**
     * A function for pathfinding using BFS algorithm
     * @param start A start point to begin path
     * @param target Target point of the path
     * @returns A path (list of points)
     */
        private bfsPathfinding(start: Point, target: Point): Point[] | null {
            const queue: { position: Point; path: Point[] }[] = [
                { position: start, path: [start] }
            ];
        
            const directions = [
                { dx: 1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: -1 }
            ];
    
            const visited = new Set<string>();
            visited.add(`${start.x},${start.y}`);
        
            while (queue.length > 0) {
                const { position, path } = queue.shift()!;
        
                if (position.x === target.x && position.y === target.y) {
                    return path;
                }
    
                for (const { dx, dy } of directions) {
                    const newX = position.x + dx;
                    const newY = position.y + dy;
                    if (
                        newX >= 0 && newX < Game.playfield.grid.length &&
                        newY >= 0 && newY < Game.playfield.grid.length &&
                        !visited.has(`${newX},${newY}`) &&
                        !(this.balls.find(e=>e.pos.x==newX&&e.pos.y==newY))
                    ) {
                        
                        visited.add(`${newX},${newY}`);
                        queue.push({
                            position: { x: newX, y: newY },
                            path: [...path, { x: newX, y: newY }]
                        });
                    }
                }
            }
            return null;
        }
    /**
     * Method for checking if there are any balls to remove
     * @returns Number of removed balls
     */
    private checkBallCrossings() {
        const directions = [
          { dx: 1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 1, dy: 1 },
          { dx: 1, dy: -1 }
        ];
    
        const toRemove = new Set<Ball>();
    
        for (const ball of this.balls) {
          for (const dir of directions) {
            const sequence: Ball[] = [ball];
            let nx = ball.pos.x + dir.dx;
            let ny = ball.pos.y + dir.dy;
    
            while (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
              const nextBall = this.balls.find(b => b.pos.x === nx && b.pos.y === ny && b.color.color === ball.color.color);
              
              if (nextBall) {
                sequence.push(nextBall);
              } else {
                break;
              }
    
              nx += dir.dx;
              ny += dir.dy;
            }
    
            if (sequence.length >= 5) {
              sequence.forEach(b => toRemove.add(b));
            }
          }
        }
        
        this.balls = this.balls.filter(b => !toRemove.has(b));
        toRemove.forEach(b=>b.clear(this.size))
    
        return toRemove.size;
    }
    /**
     * A method for randomizing colors for next round
     */
    private previewColors(){
        this.nextColors = []
        for(let i = 0;i<3;i++){
            this.nextColors.push({color: randomizeColor()})
            this.previewArr[i].style.backgroundColor = this.nextColors[i].color
        }
    }

    /**
     * A method for updating scores
     */
    private updateScores(){
        if(this.score > this.bestScore){
            this.bestScore = this.score
            localStorage.setItem("best", ""+this.bestScore)
        }
        document.querySelector("#current").innerHTML = "Score: "+this.score
        document.querySelector("#best").innerHTML = "Best score: "+this.bestScore
        
    }
    /**
     * A method for checking if the game is over
     */
    private checkGame(){

        if(this.balls.length > 77){
            this.disabled = true
            let time = new Date(Date.now() - this.startTime.getTime() - 60*60*1000)
            setTimeout(() => {
                alert("Koniec gry, uzyskałeś " + this.score + " punktów w " + time.getHours() + " godzin " + time.getMinutes() + " minut " + time.getSeconds() + " sekund")
            }, 500);
        }
    }
    /**
     * A method for checking if the ball can move
     */
    private canMove(){
        this.balls.forEach(e=>{
                if(
                    (e.pos.x > 0 && !this.balls.find(b=>b.pos.x == e.pos.x - 1 && b.pos.y == e.pos.y)) ||
                    (e.pos.x < 8 && !this.balls.find(b=>b.pos.x == e.pos.x + 1 && b.pos.y == e.pos.y)) ||
                    (e.pos.y > 0 && !this.balls.find(b=>b.pos.x == e.pos.x && b.pos.y == e.pos.y - 1)) ||
                    (e.pos.y < 8 && !this.balls.find(b=>b.pos.x == e.pos.x && b.pos.y == e.pos.y + 1))
                ){
                    e.canMove = true
                }else{
                    e.canMove = false
                }
        })
    }
        
}