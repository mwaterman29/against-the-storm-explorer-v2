import { ItemUsage } from "./ItemUsage";

export type GladeEvent = {
    id: string,
    label: string,
    description: string,
    category: string, // enum eventually

    threat: string,
    workingEffect: string,
    baseSolveTime: number,

    solveOptions1: ItemUsage[],
    solveOptions2: ItemUsage[],

    reward: ItemUsage[],
}