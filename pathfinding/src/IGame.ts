import Ball from "./Ball";

/**
 * An interface for class Game
 */
export default interface IGame{
    balls: Ball[]

    /** Holds the canvas HTML element */
    canvas: HTMLCanvasElement

    /** A variable containing current score */
    score: number

    /** A variable containing best score */
    bestScore: number

    startGame(): void
}