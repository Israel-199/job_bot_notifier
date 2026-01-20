import puppeteer from "puppeteer";

export async function scrapeJobs(skill) {
  const url = `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(skill)}`;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".job-tile")).map(el => ({
      title: el.querySelector(".job-title")?.innerText.trim(),
      link: "https://www.upwork.com" + el.querySelector("a")?.getAttribute("href"),
      description: el.querySelector(".job-description")?.innerText.trim(),
    }));
  });

  await browser.close();
  return jobs;
}
