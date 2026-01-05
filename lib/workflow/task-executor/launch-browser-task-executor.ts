import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { ExecutionEnv } from "@/lib/types/executor";
import { LaunchBrowserTask } from "../task/launch-browser-task";
import puppeteerBrowser from "puppeteer";

export async function LanuchBrowserExecutor(
  environment: ExecutionEnv<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");

    const executablePath = await chromium.executablePath();
    const isWindows = process.platform === "win32";
    const isLocal = process.env.NODE_ENV !== "production" || isWindows;
    environment.log.info(`Environment isLocal: ${isLocal}`);
    console.log(`Environment isLocal: ${isLocal}`);
    const browser = await (isLocal
      ? puppeteerBrowser.launch({ headless: true }) // Local Puppeteer
      : puppeteer.launch({
          // Serverless Puppeteer-core + Chromium
          args: chromium.args,
          executablePath: executablePath,
          headless: true,
        }));
    environment.setBrowser(browser);
    environment.log.info("Browser started successfully");

    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto(websiteUrl, { waitUntil: "networkidle2" });
    environment.setPage(page);

    environment.log.info(`Opened page at: ${websiteUrl}`);
    return true;
  } catch (error) {
    const e = error as Error;
    environment.log.error("Failed to launch browser: " + e.message);
    return false;
  }
}
