import { wait } from './wait.js';

/**
 * Waits until the page is fully loaded.
 *
 * This function waits for the `document.readyState` to be "complete",
 * indicating that the page has fully loaded. It then waits an additional
 * seconds to ensure that all resources are completely loaded.
 *
 * @param {puppeteer.Page} page - The Puppeteer page object to wait for.
 * @returns {Promise<void>} A promise that resolves when the page is fully loaded.
 */
export const waitForPageLoad = async (page) => {
    await page.waitForFunction(
        'document.readyState === "complete"'
    );
    await wait(15);
};