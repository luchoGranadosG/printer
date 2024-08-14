#! /usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import { setDefaultResultOrder } from 'dns';
import { takeScreenshots } from './utils/screenshot.js';
import { timestampFolder, loadStaticFile } from './utils/files.js';
import { validateArguments, getUrlsFile } from './utils/mainConfig.js';

setDefaultResultOrder('ipv4first');

// Define the folder for screenshots
const folder = timestampFolder();

// Main function
const main = async () => {
    // Load script arguments
    const argv = yargs(process.argv.slice(2)).parse();

    // Validate arguments
    validateArguments(argv);

    process.env.ENVIRONMENT = argv.env || 'test';

    // Get the appropriate URLs file
    const urlsFile = getUrlsFile(argv);

    try {
        const urlsObject = await loadStaticFile(urlsFile);

        // Convert the object to a list of URLs
        const urls = Object.entries(urlsObject).map(([id, url]) => ({
            id,
            url
        }));

        console.log(chalk.yellow(`\nStarting PRINTER on ${process.env.ENVIRONMENT} environment\n`));
        console.log(chalk.yellow(`The screenshots will be saved in the folder: ${folder}\n`));

        // Call takeScreenshots with the correct folder and URLs
        await takeScreenshots(urls, folder);
    } catch (error) {
        console.error(chalk.red(`Error loading URLs: ${error.message}`));
        process.exit(-1);
    }
};
//WIP Slack notifier >>

// Handle process interruption by user
process.on('SIGINT', () => {
    console.log(chalk.red('\n   Run interrupted by user (Ctrl+C)'));
    process.exit(1);
});

// Execute the main function
main();