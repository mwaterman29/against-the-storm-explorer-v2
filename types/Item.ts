import { ItemUsage } from "./ItemUsage"

export type Item = {
    id: string,
    label: string,
    usesFirst: string[],
    usesSecond: string[],
    usedIn: string[]
}
