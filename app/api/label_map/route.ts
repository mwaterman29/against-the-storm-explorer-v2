import { NextRequest, NextResponse } from "next/server";
import * as data from '@/data/items.json';

export const GET = (req: NextRequest, res: NextResponse) =>
{
    const labels = data.map(item => item.label);
    return NextResponse.json(labels);
};