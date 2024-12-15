import Ball from "./Ball";
import { Color, randomizeColor } from "./Colors";
import Grid from "./Grid";

/**
 * A variable containing currently selected ball
 */
let selected: Ball | null

interface Point {
    x: number;
    y: number;
}

export default class Game{
    public constructor(){}

    /**An array of existing balls */
    balls: Ball[] = []

    /** Holds the canvas HTML element */
    private canvas: HTMLCanvasElement = document.querySelector("canvas")!

    /** Size of ball (in px) */
    private size: number = 64

    /** A playfield matrix */
    static playfield: Grid = new Grid(9)


    /**
     * Starting game method
     */
    public startGame(){
        this.randomBalls()
        this.render()
        this.canvas.addEventListener("click", this.click.bind(this))
        this.canvas.addEventListener("mousemove", this.move.bind(this))
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

        if(newSelect){
            if(selected == newSelect){
                selected.render(this.size)
                selected = null
                return
            }
            if(selected){
                selected.render(this.size)
            }
            selected = newSelect
            selected.enlarge(this.size)
        }
        else if(selected){
            selected.clear(this.size)
            selected.move(cellX, cellY)
            selected.render(this.size)
            selected = null

            this.randomBalls()
            this.checkBallCrossings()
        }
    }
 
    
    // BFS pathfinding function
    bfsPathfinding(start: Point, target: Point, grid: (null | string | Ball)[][]): Point[] | null {
        const queue: { position: Point; path: Point[] }[] = [
            { position: start, path: [start] }
        ];
    
        const directions = [
            { dx: 1, dy: 0 },  // Right
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }, // Left
            { dx: 0, dy: -1 }  // Up
        ];

        const visited = new Set<string>(); // To track visited cells
        visited.add(`${start.x},${start.y}`);
    
        while (queue.length > 0) {
            const { position, path } = queue.shift()!;
    
            // If we reached the target, return the path
            if (position.x === target.x && position.y === target.y) {
                return path;
            }
    
            // Explore neighbors
            for (const { dx, dy } of directions) {
                const newX = position.x + dx;
                const newY = position.y + dy;
                console.log(this.balls.find(e=>e.x==newX&&e.y==newY));
                
                // Check if the new position is within bounds and not visited
                if (
                    newX >= 0 && newX < 9 &&
                    newY >= 0 && newY < 9 &&
                    !visited.has(`${newX},${newY}`) &&
                    // grid[newY][newX] == undefined // Ensure the cell is not an obstacle
                    !(this.balls.find(e=>e.x==newX&&e.y==newY))
                ) {
                    console.log("chuj");
                    
                    visited.add(`${newX},${newY}`);
                    queue.push({
                        position: { x: newX, y: newY },
                        path: [...path, { x: newX, y: newY }]
                    });
                }
            }
        }
    
        // If no path is found, return null
        return null;
    }
    
    private move(e: MouseEvent){
        const cellX = Math.floor(e.offsetX / this.size)
        const cellY = Math.floor(e.offsetY / this.size)

        if(selected){
            let start: Point = {x:selected.x, y:selected.y}
            let end: Point = {x:cellX, y:cellY}
            
            let path = this.bfsPathfinding(start,end,Game.playfield.grid);

            this.render()
            if(path){
                path.forEach(e=>{
                const ctx = this.canvas.getContext("2d")!
                ctx.fillStyle = "red"
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
            const ball = new Ball(randX, randY, randomizeColor())
            ball.render(this.size)
            Game.playfield.grid[randY][randX] = ball
            this.balls.push(ball)
        }
        console.log(Game.playfield.grid);
        console.log(this.balls);
        
        
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
        
}