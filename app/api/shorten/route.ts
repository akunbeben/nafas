import { NextRequest, NextResponse } from "next/server";
import { nanoid } from 'nanoid';

// This would be replaced with a database in a production environment
const urlMap = new Map<string, string>();

export async function POST(req: NextRequest) {
    const { url } = await req.json();

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const id = nanoid(8);
    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/s/${id}`;

    urlMap.set(id, url);

    return NextResponse.json({ shortUrl });
}
