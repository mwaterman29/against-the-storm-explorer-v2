import { NextRequest, NextResponse } from "next/server";
//import * as data from '@/data/items.json';
import { items } from "@/data/items";

export const GET = (req: NextRequest, res: NextResponse) =>
{
    const labels = items.map(item => item.label);
    return NextResponse.json(labels);
};