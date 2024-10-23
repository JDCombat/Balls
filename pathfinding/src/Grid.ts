import Ball from "./Ball";

export default class Grid{
    grid: Ball[][] =[]

    constructor(size:number){
        this.grid = Array.from(Array(9), () => Array(9).fill(""))
    }
}