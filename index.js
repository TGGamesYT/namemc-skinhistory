import puppeteer from "puppeteer";

/**
 * Get Minecraft UUID from username
 * @param {string} username
 * @returns {string|null} UUID without dashes
 */
export async function getUuidFromUsername(username) {
    const url = `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`;
    const response = await fetch(url);
  
    if (response.status === 204) {
      // No such user
      return null;
    }
  
    if (!response.ok) {
      throw new Error(`Error fetching UUID: ${response.status} ${response.statusText}`);
    }
  
    const data = await response.json();
    // data.id is the UUID without dashes
    return data.id;
  }

/**
 * Get NameMC skin history from UUID
 * @param {string} uuid
 * @returns {string[]} Array of skin image URLs
 */
export async function getSkinHistory(uuid) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Optional: set a real user-agent
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
    );

    await page.goto(`https://namemc.com/profile/${uuid}`, { waitUntil: "networkidle2" });

    const skinIds = await page.$$eval("a[href^='/skin/']", links =>
        links.map(a => a.href.split("/").pop())
    );

    await browser.close();

    return skinIds.map(id => `https://s.namemc.com/i/${id}.png`);
}
