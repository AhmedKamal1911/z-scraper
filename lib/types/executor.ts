import { WorkflowTask } from "./workflow";
import { LogCollector } from "./log";
import { Browser as CoreBrowser, Page as CorePage } from "puppeteer-core";
import { Browser as LocalBrowser, Page as LocalPage } from "puppeteer";

export type PuppeteerBrowser = CoreBrowser | LocalBrowser;
export type PuppeteerPage = CorePage | LocalPage;

export type Environment = {
  browser?: PuppeteerBrowser;
  page?: PuppeteerPage;
  phases: {
    [key: string]: {
      // nodeid or taskid
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
};

export type ExecutionEnv<X extends WorkflowTask> = {
  getInput(name: X["inputs"][number]["name"]): string;
  setOutput(name: X["outputs"][number]["name"], value: string): void;
  getBrowser(): PuppeteerBrowser | undefined;
  setBrowser(browser: PuppeteerBrowser): void;
  setPage(page: PuppeteerPage): void;
  getPage(): PuppeteerPage | undefined;
  log: LogCollector;
};
