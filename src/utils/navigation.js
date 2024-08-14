import chalk from 'chalk';
import { waitForPageLoad } from './validators.js';

/**
 * Navigates to a given URL using the provided puppeteer page instance.
 *
 * @param {import('puppeteer').Page} page - The puppeteer page instance to use for navigation.
 * @param {number} id - The identifier for the current url.
 * @param {string} url - The URL to navigate.
 * @returns {Promise<{success: boolean, error?: string}>} - An object indicating the success status and an optional error message.
 */
export const navigateToUrl = async (page, id, url) => {
    try {
        console.log(chalk.yellow(`id: ${id} ➜ Browsing to URL: ${url}`));
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

        await waitForPageLoad(page);
        return { success: true };
    } catch (error) {
        const errorMessage = error.message;
        switch (true) {
            case errorMessage.includes('ERR_NAME_NOT_RESOLVED'):
                console.error(chalk.red(`id: ${id} ✘ Error: Name could not be resolved: ${url}`));
                break;
            case errorMessage.includes('TimeoutError'):
            case errorMessage.includes('Navigation timeout'):
                console.error(chalk.red(`id: ${id} ✘ Error: Timeout`));
                break;
            case errorMessage.includes('ERR_INVALID_AUTH_CREDENTIALS'):
                console.error(chalk.red(`id: ${id} ✘ Error: Invalid credentials`));
                break;
            default:
                console.error(chalk.red(`id: ${id} ✘ Error taking screenshot: ${errorMessage}`));
                break;
        }
        return { success: false, error: errorMessage };
    }
};