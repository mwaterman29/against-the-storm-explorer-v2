import { ItemUsage } from "./ItemUsage"

export type Item = {
    id: string,
    label: string,
    usesFirst: ItemUsage[],
    usesSecond: ItemUsage[],
    usedIn: string[]
}
