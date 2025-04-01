import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

let cachedData: any = null;
let lastFetchedTime = 0;
const CACHE_TTL = 10 * 60 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const now = Date.now();
    if (cachedData && now - lastFetchedTime < CACHE_TTL) {
      console.log('Serving from cache');
      return res.status(200).json({ table: cachedData });
    }

    console.log('Fetching fresh data...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.iplt20.com/points-table/men', { waitUntil: 'domcontentloaded' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.waitForSelector('tbody tr', { timeout: 15000 });

    const tableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));

      return rows.map(row => {
        const columns = row.querySelectorAll('td');

        return {
          position: columns[0]?.textContent?.trim() || '',
          team: row.querySelector('.ih-t-color h2.ih-pt-cont')?.textContent?.trim() || '',
          matches: columns[2]?.textContent?.trim() || '',
          wins: columns[3]?.textContent?.trim() || '',
          losses: columns[4]?.textContent?.trim() || '',
          ties: columns[5]?.textContent?.trim() || '',
          nrr: columns[6]?.textContent?.trim() || '',
          for: columns[7]?.textContent?.trim() || '',
          against: columns[8]?.textContent?.trim() || '',
          points: columns[9]?.textContent?.trim() || '',
          recentForm: row.querySelector('.ih-pt-fb')?.textContent?.trim() || ''
        };
      });
    });

    console.log('Fetched new IPL Points Table:', tableData);

    await browser.close();

    cachedData = tableData;
    lastFetchedTime = now;

    res.status(200).json({ table: tableData });

  } catch (error) {
    console.error('Error scraping IPL table:', error);
    res.status(500).json({ error: 'Failed to scrape IPL points table' });
  }
}
