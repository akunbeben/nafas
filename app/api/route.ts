import type { NextApiRequest, NextApiResponse } from "next"
import chromium from "chrome-aws-lambda"
import playwright from "playwright-core"

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath:
      process.env.NODE_ENV !== "development"
        ? await chromium.executablePath
        : "/usr/bin/google-chrome",
    headless: process.env.NODE_ENV !== "development" ? chromium.headless : true,
  })

  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 720,
    },
  })

  const url = req.query.path as string

  await page.goto(url)

  const data = await page.screenshot({
    type: "png",
  })

  await browser.close()

  // Set the `s-maxage` property to cache at the CDN layer
  res.setHeader("Cache-Control", "s-maxage=31536000, public")
  res.setHeader("Content-Type", "image/png")
  res.end(data)
}