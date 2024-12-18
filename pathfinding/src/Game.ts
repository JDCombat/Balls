import Ball from "./Ball";
import { Color, randomizeColor } from "./Colors";
import Grid from "./Grid";
import { Point } from "./IPoint";

/**
 * A variable containing currently selected ball
 */
let selected: Ball | null



export default class Game{
    public constructor(){}

    /**An array of existing balls */
    public balls: Ball[] = []

    /** Holds the canvas HTML element */
    readonly canvas: HTMLCanvasElement = document.querySelector("canvas")!

    /** Size of ball (in px) */
    private size: number = 64

    /** A playfield matrix */
    static playfield: Grid = new Grid(9)

    private nextColors: Color[] = []

    public score: number = 0

    public bestScore: number = Number(localStorage.getItem("best")) ?? 0

    private currentPath: Point[]
    
    private previewContainer: HTMLDivElement = document.querySelector("#preview")

    private previewArr: NodeListOf<HTMLDivElement> = document.querySelectorAll("#preview > div")


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
        console.log(Math.floor(e.offsetX / 64), Math.floor(e.offsetY/64));
        const cellX = Math.floor(e.offsetX / this.size)
        const cellY = Math.floor(e.offsetY / this.size)

        console.log(selected);
        
        const newSelect = this.balls.find(e=>e.x==cellX && e.y==cellY)

        const directions = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: -1 }
        ];
        // for(const {dx, dy} of directions){
        //     const newX = newSelect.x + dx
        //     const newY = newSelect.y + dy

        //     if(
        //         newX < 0 && newY
        //     )
        // }

        if(newSelect){
            if(selected == newSelect){
                selected.large = false
                selected.render(this.size)
                selected = null
                return
            }
            if(selected){
                selected.large = false
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
            selected.clear(this.size)
            selected.move(cellX, cellY)
            selected.large = false
            selected.render(this.size)
            selected = null

            let points = this.checkBallCrossings()
            this.score += points
            if(points === 0){
                this.randomBalls(this.nextColors)
            }
            this.updateScores()
            this.previewColors()
            this.checkGame()
        }
    }
 

    
    private move(e: MouseEvent){
        const cellX = Math.floor(e.offsetX / this.size)
        const cellY = Math.floor(e.offsetY / this.size)

        if(selected){
            let start: Point = {x:selected.x, y:selected.y}
            let end: Point = {x:cellX, y:cellY}
            
            this.currentPath = this.bfsPathfinding(start,end);

            this.render()
            if(this.currentPath){
                this.currentPath.forEach(e=>{
                const ctx = this.canvas.getContext("2d")!
                ctx.fillStyle = "rgba(255,0,0,0.4)"
                ctx.fillRect(e.x*64+2,e.y*64+2,60,60)
            })

        }
            
        }
    }

    /**
     * Generates balls on random locations with random colors
     *  @param color If not null an array of colors to generate new balls with
     */
    private randomBalls(color?: Color[]){
        for(let i = 0; i < 3; i++){
            const randX = Math.floor(Math.random()*9)
            const randY = Math.floor(Math.random()*9)
            if(this.balls.find(e=>e.x == randX && e.y == randY)){
                i--
                continue
            }
            const ball = new Ball(randX, randY, color ? color[i] : randomizeColor())
            ball.render(this.size)
            Game.playfield.grid[randY][randX] = ball
            this.balls.push(ball)
        }
        console.log(Game.playfield.grid);
        console.log(this.balls);
        
        
    }
    /**
     * 
     * @param start A start point to begin path
     * @param target Target point of the path
     * @returns A path (list of points)
     */
        bfsPathfinding(start: Point, target: Point): Point[] | null {
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
                        newX >= 0 && newX < 9 &&
                        newY >= 0 && newY < 9 &&
                        !visited.has(`${newX},${newY}`) &&
                        !(this.balls.find(e=>e.x==newX&&e.y==newY))
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
            let nx = ball.x + dir.dx;
            let ny = ball.y + dir.dy;
    
            while (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
              const nextBall = this.balls.find(b => b.x === nx && b.y === ny && b.color === ball.color);
              
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

    previewColors(){
        this.nextColors = []
        for(let i = 0;i<3;i++){
            this.nextColors.push(randomizeColor())
            this.previewArr[i].style.backgroundColor = this.nextColors[i]
        }
    }

    updateScores(){
        if(this.score > this.bestScore){
            this.bestScore = this.score
            localStorage.setItem("best", ""+this.bestScore)
        }
        document.querySelector("#current").innerHTML = "Score: "+this.score
        document.querySelector("#best").innerHTML = "Best score: "+this.bestScore
        
    }

    checkGame(){
        // for(let )
    }
        
}