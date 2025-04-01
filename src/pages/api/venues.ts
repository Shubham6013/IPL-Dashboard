import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

let cachedVenues: any = null;
let lastFetchedTime = 0;
const CACHE_TTL = 10 * 60 * 1000; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const now = Date.now();

    if (cachedVenues && now - lastFetchedTime < CACHE_TTL) {
      console.log("Serving venues data from cache");
      return res.status(200).json({ venues: cachedVenues });
    }

    console.log("Fetching fresh IPL venue data...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    );

    await page.goto("https://www.iplt20.com/venues", { waitUntil: "domcontentloaded" });
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.waitForSelector(".np-venu_innerWrp", { timeout: 15000 });

    const venueData = await page.evaluate(() => {
      const venueCards = Array.from(document.querySelectorAll(".np-venu_innerWrp"));

      return venueCards.map(card => {
        const name = card.getAttribute("data-title") || "";
        const type = card.getAttribute("data-type") || "";
        const link = card.getAttribute("href") || "";
        const image = card.querySelector("img")?.getAttribute("src") || "";
        const city = card.querySelector("h6")?.textContent?.trim() || "";

        return { name, type, city, link, image };
      });
    });

    console.log("Fetched new IPL venues:", venueData);

    await browser.close();

    cachedVenues = venueData;
    lastFetchedTime = now;

    res.status(200).json({ venues: venueData });

  } catch (error) {
    console.error("Error scraping venues:", error);
    res.status(500).json({ error: "Failed to scrape IPL venues" });
  }
}
