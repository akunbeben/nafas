import { NextRequest, NextResponse } from "next/server";

// This would be replaced with a database lookup in a production environment
const urlMap = new Map<string, string>();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const url = urlMap.get(id);

    if (url) {
        return NextResponse.redirect(url);
    } else {
        return NextResponse.redirect('/404');
    }
}
