import { NextRequest } from "next/server"
import puppeteer from "puppeteer"
import chromium from "@sparticuz/chromium"

export const maxDuration = 60
export const revalidate = 300

export async function GET(request: NextRequest) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"]
  })

  try {
    const page = await browser.newPage()
    const url = request.nextUrl.searchParams.get("path") as string
    await page.setViewport({ width: 1200, height: 630 })
    await page.goto(url)

    const data = await page.screenshot({
      type: "png",
    })

    return new Response(data, {
      headers: {
        "Cache-Control": "s-maxage=31536000, public",
        "Content-Type": "image/png"
      }
    })
  } finally {
    await browser.close()
  }
}