import chalk from 'chalk';

// Valid environment values
const environments = ['latest', 'stage', 'live'];

/**
 * Validates the command-line arguments.
 *
 * @param {Object} argv - The parsed command-line arguments.
 * @param {boolean} [argv.test] - Indicates if the test mode is enabled.
 * @param {string} [argv.env] - The environment to use (latest, stage, live).
 * @throws Will throw an error if the arguments are invalid.
 */
export const validateArguments = (argv) => {
    if (argv.test) {
        if (argv.env || Object.keys(argv).length > 1) {
            console.error(chalk.red(`The --test parameter must be used alone without env parameter.`));
            process.exit(-1);
        }
    } else {
        if (!argv.env || !environments.includes(argv.env)) {
            console.error(chalk.red(`Please provide a valid environment\n➜ ${environments.join(' or ')}`));
            console.log(chalk.yellow('Example: printer --env=latest'));
            process.exit(-1);
        }
    }
};

/**
 * Gets the appropriate URLs file based on the command-line arguments.
 *
 * @param {Object} argv - The parsed command-line arguments.
 * @param {boolean} [argv.test] - Indicates if the test mode is enabled.
 * @param {string} [argv.env] - The environment to use (latest, stage, live).
 * @returns {string} - The name of the URLs file to use.
 * @throws Will throw an error if the environment is invalid.
 */
export const getUrlsFile = (argv) => {
    if (argv.test) {
        return 'test.json';
    }
    switch (argv.env) {
        case 'stage':
            return 'urls_stage.json';
        case 'latest':
            return 'urls_latest.json';
        case 'live':
            return 'urls_live.json';
        default:
            throw new Error('Invalid environment');
    }
};