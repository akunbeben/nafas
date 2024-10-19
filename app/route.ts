import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "~/lib/utils";
import { Result } from "~/types";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const age = parseInt(searchParams.get('age') || '0', 10);
    const mode = parseInt(searchParams.get('mode') || '60', 10) as 30 | 60;

    const init: Result = {
        state: 0,
        cycles: [],
        average: 0,
        mode: mode,
        age: age
    }

    const result = encrypt(init);

    return NextResponse.redirect(new URL(`/${result}`, req.url));
}
