export type ProductionBuilding = {
    id: string;
    produces: {
        output: string;
        tier: number;
        outputCount: number;
        producedBy: string;
        ingredientsFirst: string[];
        ingredientsFirstCounts: number[];
        ingredientsSecond: string[];
        ingredientsSecondCounts: number[];
        timeInSeconds: number;
    }[];
    category: string;
    workerSlots: number;
}