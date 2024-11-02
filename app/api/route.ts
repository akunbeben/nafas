import { NextRequest } from "next/server"
import puppeteer from "puppeteer"
import * as install from "puppeteer/internal/node/install.js"

export const maxDuration = 60
export const revalidate = 300

export async function GET(request: NextRequest) {
  await install.downloadBrowsers()

  const browser = await puppeteer.launch({
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--single-process",
      "--no-sandbox"
    ],
    headless: true,
  })

  try {
    const page = await browser.newPage()
    const url = request.nextUrl.searchParams.get("path") as string
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