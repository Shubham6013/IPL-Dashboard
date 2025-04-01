import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

let cachedTeams: any = null;
let lastFetchedTime = 0;
const CACHE_TTL = 10 * 60 * 1000; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const now = Date.now();

    if (cachedTeams && now - lastFetchedTime < CACHE_TTL) {
      console.log("Serving teams data from cache");
      return res.status(200).json({ teams: cachedTeams });
    }

    console.log("Fetching fresh IPL teams data...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    );

    await page.goto("https://www.iplt20.com/teams", { waitUntil: "domcontentloaded" });

    await page.waitForSelector(".vn-team-logo img", { timeout: 15000 });

    const teamsData = await page.evaluate(() => {
      const teamElements = Array.from(document.querySelectorAll("li"));

      return teamElements
        .map((team) => {
          const logoElement = team.querySelector(".vn-team-logo img") as HTMLImageElement;
          const hoverLogoElement = team.querySelector(".vn-team-logo-onhover img") as HTMLImageElement;
          const teamNameElement = team.querySelector(".ap-team-contn h3");
          const teamLink = team.querySelector("a") as HTMLAnchorElement;
          const trophiesElement = team.querySelector(".team-on-hover .trophy-text-align");

          return {
            name: teamNameElement?.textContent?.trim() || "",
            logo: logoElement?.src || "",
            hoverLogo: hoverLogoElement?.src || "",
            url: teamLink?.href || "",
            trophies: trophiesElement?.textContent?.trim() || "No Trophies"
          };
        })
        .filter((team) => team.name); 
    });

    console.log("Fetched new IPL Teams:", teamsData);

    await browser.close();

    cachedTeams = teamsData;
    lastFetchedTime = now;

    res.status(200).json({ teams: teamsData });

  } catch (error) {
    console.error("Error scraping IPL teams:", error);
    res.status(500).json({ error: "Failed to scrape IPL teams" });
  }
}
