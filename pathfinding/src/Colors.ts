export type Color = "cornflowerblue" | "chartreuse" | "lightglodenrodyellow" | "dimgray" | "bisque" | "lightcoral"| "navyblue"
const arr: Color[] = ["bisque", "chartreuse", "cornflowerblue", "dimgray", "lightcoral", "lightglodenrodyellow", "navyblue"]
export const randomize = () =>{
    const randomInt = Math.floor(Math.random() * 7)
    return arr[randomInt]
}