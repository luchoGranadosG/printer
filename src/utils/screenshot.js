import path from 'path';
import chalk from 'chalk';
import pLimit from 'p-limit';
import { cleanFileName, createFolderIfNotExists } from './files.js';
import { launchBrowser, createPage } from './puppeteerConfig.js';
import { navigateToUrl } from './navigation.js';
import { compressImage, getPageSize } from './image.js';

const CONCURRENCY_LIMIT = 5; // Amount of tasks in a group
const MAX_RETRIES = 3; // Max retries

/**
 * Takes a screenshot of a given URL using a Puppeteer browser instance.
 *
 * @param {import('puppeteer').Browser} browser - The Puppeteer browser instance.
 * @param {string} id - The identifier for the screenshot task.
 * @param {string} url - The URL to take a screenshot of.
 * @param {string} folder - The folder to save the screenshot in.
 * @param {number} [retries=0] - The current retry count.
 * @returns {Promise<void>} - A promise that resolves when the screenshot is taken.
 * @throws Will throw an error if the screenshot cannot be taken after the maximum number of retries.
 */
const takeScreenshot = async (browser, id, url, folder, retries = 0) => {
    const page = await createPage(browser);
    try {
        const { success, error } = await navigateToUrl(page, id, url);

        if (!success) {
            if (error && (error.includes('TimeoutError') || error.includes('Navigation timeout'))) {
                console.log(chalk.yellow(`id: ${id} Take a screenshot regardless of the timeout`));
            } else {
                throw new Error(`id: ${id} Navigation failed: ${error}`);
            }
        }

        // Getting the page size
        const boundingBox = await getPageSize(page);

        if (boundingBox && boundingBox.height) {
            const height = Math.ceil(boundingBox.height);
            await page.setViewport({
                width: 1920,
                height: height
            });
        } else {
            console.log(chalk.yellow(`id: ${id} Bounding box not available or height is zero, using default height`));
        }

        const fileName = `${cleanFileName(id, url)}.png`;
        const filePath = path.join(folder, fileName);
        await page.screenshot({ path: filePath, fullPage: true });

        // Compress the image
        const compressedFileName = boundingBox && boundingBox.height ? `${cleanFileName(id, url)}.jpg` : `${cleanFileName(id, url)}-REDIRECTION.jpg`;
        await compressImage(filePath, folder, compressedFileName);

        console.log(chalk.green.bold(`\nid: ${id} ✓ Screenshot saved\n`));

    } catch (error) {
        if (retries < MAX_RETRIES) {
            console.log(chalk.cyan(`id: ${id} ✘ Error taking screenshot, retrying...`) + chalk.red(`${retries + 1}/${MAX_RETRIES}`));
            await takeScreenshot(browser, id, url, folder, retries + 1);
        } else {
            console.error(chalk.red(`id: ${id} ✘ Error taking screenshot after ${MAX_RETRIES} retries: ${error.message}`));
        }
    } finally {
        await page.close();
    }
};

/**
 * Takes screenshots of multiple URLs and saves them in the specified folder.
 *
 * @param {Array<{id: string, url: string}>} urls - An array of objects containing the IDs and URLs to take screenshots of.
 * @param {string} folder - The folder to save the screenshots in.
 * @returns {Promise<void>} - A promise that resolves when all screenshots are taken.
 * @throws Will throw an error if the folder cannot be created or the browser cannot be launched.
 */
export const takeScreenshots = async (urls, folder) => {
    createFolderIfNotExists(folder);

    const browser = await launchBrowser();
    const limit = pLimit(CONCURRENCY_LIMIT);

    try {
        // Create a list of tasks
        const tasks = urls.map(({ id, url }) => limit(() => takeScreenshot(browser, id, url, folder)));

        // Execute tasks
        await Promise.all(tasks);
    } finally {
        await browser.close();
    }
};