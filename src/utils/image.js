import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { waitForPageLoad } from './validators.js';

/**
 * Compress an image using sharp.
 * @param {string} inputPath - The path to the input image.
 * @param {string} outputFolder - The folder to save the compressed image.
 * @param {string} fileName - The name of the compressed image file.
 * @param {number} [width=1280] - The width to resize the image to.
 * @param {number} [quality=80] - The quality of the compressed image.
 * @returns {Promise<string>} - The path to the compressed image.
 */
export const compressImage = async (inputPath, outputFolder, fileName, width = 1280, quality = 80) => {
    const outputPath = path.join(outputFolder, fileName);

    await sharp(inputPath)
        .resize(width) // Resize the image
        .jpeg({ quality }) // Compress the image
        .toFile(outputPath);

    // Delete the original image
    fs.unlinkSync(inputPath);

    return outputPath;
};

/**
 * Get the bounding box of the page body.
 * @param {object} page - The Puppeteer page object.
 * @returns {Promise<object>} - The bounding box of the page body.
 */
export const getPageSize = async (page) => {
    let bodyHandle = await page.$('body');
    let boundingBox = await bodyHandle.boundingBox();
    await bodyHandle.dispose();

    if (boundingBox && boundingBox.height === 0) {
        console.log(chalk.yellow('   Page height is zero, retrying...'));
        await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
        await waitForPageLoad(page);

        bodyHandle = await page.$('body');
        boundingBox = await bodyHandle.boundingBox();
        await bodyHandle.dispose();
    }

    return boundingBox;
};