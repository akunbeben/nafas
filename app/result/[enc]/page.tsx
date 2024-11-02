import { ResultsView } from "~/components/ResultsView";
import { headers } from 'next/headers';
import { getFullUrl } from "~/utils/helper";
import puppeteer from "puppeteer";

export async function generateMetadata({ params }: { params: Promise<{ enc: string }> }) {
    const { enc } = await params;
    const headersList = await headers();
    const url = headersList.get('host');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${getFullUrl(url)}/image/${enc}`);
    const image = await page.screenshot({ path: "example.png" });
    await browser.close();

    const imageBuffer = Buffer.from(image);

    return {
        title: `Respiratory Rate: ${enc}`,
        description: `Your respiratory rate is ${enc} breaths per minute.`,
        openGraph: {
            title: `Respiratory Rate: ${enc}`,
            description: `Your respiratory rate is ${enc} breaths per minute.`,
            images: `data:image/png;base64,${imageBuffer.toString('base64')}`
        }
    }
}

export default async function Result({ params }: { params: Promise<{ enc: string }> }) {
    const { enc } = await params;

    return (
        <ResultsView state={enc} />
    )
}