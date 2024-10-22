import { CornerstoneSale } from "./CornerstoneSale";

//Effect internally
export type Cornerstone = 
{
    id: string,
    label: string,
    description: string,
    tier: string, // enum eventually
    type: string, // 'cornerstone' | 'perk' | 'effect'
    biomeLock: string[],
    soldBy: CornerstoneSale[],
}