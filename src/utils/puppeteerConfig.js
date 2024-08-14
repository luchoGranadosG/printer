import puppeteer from 'puppeteer';

/**
 * Launches a new Puppeteer browser instance.
 *
 * @returns {Promise<import('puppeteer').Browser>} - A promise that resolves to a Puppeteer browser instance.
 */
export const launchBrowser = async () => {
    return await puppeteer.launch();
};

/**
 * Creates a new page in the given Puppeteer browser instance.
 *
 * @param {import('puppeteer').Browser} browser - The Puppeteer browser instance.
 * @returns {Promise<import('puppeteer').Page>} - A promise that resolves to a Puppeteer page instance.
 */
export const createPage = async (browser) => {
    return await browser.newPage();
};