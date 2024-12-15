export type Color = "cornflowerblue" | "chartreuse" | "lightgoldenrodyellow" | "dimgray" | "bisque" | "lightcoral"| "navy"
const arr: Color[] = ["bisque", "chartreuse", "cornflowerblue", "dimgray", "lightcoral", "lightgoldenrodyellow", "navy"]
export const randomizeColor = () =>{
    const randomInt = Math.floor(Math.random() * 7)
    return arr[randomInt]
}