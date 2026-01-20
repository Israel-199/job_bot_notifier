import fetch from "node-fetch";
import cheerio from "cheerio";

export async function scrapeJobs(skill) {
  const url = `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(skill)}`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const jobs = [];
  $(".job-tile").each((i, el) => {
    jobs.push({
      title: $(el).find(".job-title").text().trim(),
      link: "https://www.upwork.com" + $(el).find("a").attr("href"),
      description: $(el).find(".job-description").text().trim(),
    });
  });

  return jobs;
}
