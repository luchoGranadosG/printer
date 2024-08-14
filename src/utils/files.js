import moment from 'moment';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Generates a clean file name by combining an ID and a URL.
 * The URL is sanitized by removing the protocol and replacing invalid characters with underscores.
 *
 * @param {number|string} id - The unique identifier to be included in the file name.
 * @param {string} url - The URL to be sanitized and included in the file name.
 * @returns {string} The generated clean file name.
 */
export const cleanFileName = (id, url) => {
    return `${id}_${url.replace(/https?:\/\//, '') // Remove protocol
        .replace(/[\/?&=#]/g, '_')}`; // Replace invalid characters
};

/**
 * Returns the current date and time formatted as 'YYYY.MM.DD-HH.mm.ss'.
 *
 * @returns {string} The formatted date and time string.
 */
export const getFormattedDateTime = () => {
    return moment().format('YYYY.MM.DD-HH.mm.ss');
};

/**
 * Reads a JSON file from the specified file path and returns the parsed URLs.
 *
 * @param {string} filePath - The path to the JSON file containing the URLs.
 * @returns {Array<string>} An array of URLs read from the file.
 * @throws {Error} If the file cannot be read or the content is not valid JSON.
 */
export const readUrlsFromFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    const urls = JSON.parse(data);
    return urls;
};

/**
 * Creates a timestamped folder path using the current date and time.
 *
 * @returns {string} The base screenshot folder path with a timestamp.
 */
export const timestampFolder = () => {
    const baseScreenshotFolder = './screenshots';
    return path.join(baseScreenshotFolder, getFormattedDateTime());
};

// Function to create a folder if it doesn't exist
export const createFolderIfNotExists = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

export const loadStaticFile = (filepath, loadAsJson = true) => {
    try {
        const content = fs.readFileSync(path.join(process.cwd(), `src/static/${filepath}`));

        return loadAsJson ? JSON.parse(content) : content;
    } catch (error) {
        console.error(chalk.red(`Could not load ${filepath}`), error);
    }
};
