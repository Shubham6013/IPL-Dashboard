import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

let cachedSchedule: any = null;
let lastFetchedTime = 0;
const CACHE_TTL = 10 * 60 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const now = Date.now();

    if (cachedSchedule && now - lastFetchedTime < CACHE_TTL) {
      console.log('Serving match schedule from cache');
      return res.status(200).json({ schedule: cachedSchedule });
    }

    console.log('Fetching fresh match schedule...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.iplt20.com/matches/fixtures', { waitUntil: 'domcontentloaded' });

    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.waitForSelector('li.ng-scope', { timeout: 15000 });
    const matchSchedule = await page.evaluate(() => {
      const matches = Array.from(document.querySelectorAll('li.ng-scope'));

      return matches.map(match => {
        const matchNumber = match.querySelector('.vn-matchOrder')?.textContent?.trim() || '';
        const date = match.querySelector('.vn-matchDate')?.textContent?.trim() || '';
        const time = match.querySelector('.vn-matchTime')?.textContent?.trim() || '';
        const venue = match.querySelector('.vn-venueDet p')?.textContent?.trim() || '';

        const homeTeam = match.querySelector('.vn-shedTeam .vn-teamName h3')?.textContent?.trim() || '';
        const homeTeamLogo = match.querySelector('.vn-shedTeam img')?.getAttribute('src') || '';

        const awayTeam = match.querySelector('.vn-team-2 .vn-teamName h3')?.textContent?.trim() || '';
        const awayTeamLogo = match.querySelector('.vn-team-2 img')?.getAttribute('src') || '';

        const matchUrl = match.querySelector('.vn-matchBtn')?.getAttribute('href') || '#';

        return {
          matchNumber,
          date,
          time,
          venue,
          homeTeam,
          homeTeamLogo,
          awayTeam,
          awayTeamLogo,
          matchUrl,
        };
      });
    });

    await browser.close();
    cachedSchedule = matchSchedule;
    lastFetchedTime = now;

    res.status(200).json({ schedule: matchSchedule });

  } catch (error) {
    console.error('Error scraping IPL schedule:', error);
    res.status(500).json({ error: 'Failed to scrape IPL schedule' });
  }
}
