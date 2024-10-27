import { deleteMatchingImages } from "@/utils/img/deleteMatchingImages";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() 
{
    if(process.env.NODE_ENV != 'development')
    {
        return NextResponse.json({ message: 'This endpoint is only available in development mode' });
    }

    const imgFolderPath = path.join(process.cwd(), 'public', 'img');
    deleteMatchingImages(imgFolderPath);
    return NextResponse.json({ message: 'Images cleaned successfully' });
}