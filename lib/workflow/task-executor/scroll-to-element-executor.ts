import { ExecutionEnv, PuppeteerPage } from "@/lib/types/executor";
import { ScrollToElementTask } from "../task/scroll-to-element-task";
import { Page as CorePage } from "puppeteer-core";
export async function ScrollToElementExecutor(
  environment: ExecutionEnv<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Missing required input: 'Selector'.");
      return false;
    }

    const page = environment.getPage() as PuppeteerPage;
    if (!page) {
      environment.log.error("Page instance is not available.");
      return false;
    }
    environment.log.info(`Scrolling to element by using selector: ${selector}`);
    await (page as CorePage).evaluate((selector: string) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error("Element not found");
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementTop });
    }, selector);
    environment.log.info("Scrolled to element successfully.");
    return true;
  } catch (error) {
    const e = error as Error;

    environment.log.error("Failed scrolling to element.");
    environment.log.error(`Internal error: ${e.message}`);

    return false;
  }
}
