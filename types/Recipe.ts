import { RecipeTier } from "./RecipeTier"

export type Recipe = {
    id: string,
    source: string,
    target: string,
    tiers: { [key: number]: RecipeTier }
}