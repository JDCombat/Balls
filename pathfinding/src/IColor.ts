export type Color = "cornflowerblue" | "chartreuse" | "lightgoldenrodyellow" | "dimgray" | "bisque" | "lightcoral"| "navy"
/**
 * @interface IColor
 * Interface for color object
 */
export interface IColor{
    color: Color
}
/**
 * @constant arr
 * Array of colors
 */
const arr: Color[] = ["bisque", "chartreuse", "cornflowerblue", "dimgray", "lightcoral", "lightgoldenrodyellow", "navy"]
/**
 * A function for randomizing color from the array
 * @returns Random color from the array
 */
export const randomizeColor = () =>{
    const randomInt = Math.floor(Math.random() * arr.length)
    return arr[randomInt]
}
