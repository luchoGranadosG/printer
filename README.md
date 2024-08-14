
# Screenshot Printer

Screenshot Printer is a command-line tool that takes screenshots of various URLs using Puppeteer. The screenshots are saved in a timestamped directory.

This tool is focused on environments that are used for pre/post validations during a GCX release but can be used for more general purposes.

## Features

- Takes screenshots of a list of URLs.
- Allows you to select the url file to use depending on the --env parameter (latest, stage, live).
- Supports test mode.
- Handles retries in case of errors.

## Installation

1. Clone the repository:

   ```bash
   git clone <REPOSITORY_URL>
   cd <PROJECT_NAME>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

### Basic Execution

To run the script, use the following command:

```bash
printer --env=<environment>
```

### Parameters

- `--env`: Specifies the environment for which to take screenshots. Valid values are `latest`, `stage`, `live`.
- `--test`: Test mode. Should be used without other parameters.

### Examples

```bash
printer --env=latest
```

```bash
printer --env=stage
```

```bash
printer --test
```

## Configuration Files

- `urls_latest.json`: List of URLs for the `latest` environment.
- `urls_stage.json`: List of URLs for the `stage` environment.
- `urls_live.json`: List of URLs for the `live` environment.
- `test.json`: List of URLs for test mode.

## Usage Guide

1. **Set Environment:** The environment can be specified using the `--env` parameter.
2. **Test Mode:** Can be activated using the `--test` parameter.

## Error Handling

- The tool attempts to take a screenshot up to a maximum of 3 times if it encounters errors.
- Common errors include `TimeoutError`, network issues, or invalid credentials.

## Advantages

- It is configured to parallelize tasks, with a 5-element set configuration.
- Due to the parallelization, the capture times are low (160 images in +- 18 minutes).
- It makes use of the Sharp library which allows to optimize the size of the images taken, achieving a folder of 50 megabytes containing 160 images.
- It does not use too many computer resources, so the user can continue to perform his activities without compromising the Printer's stability.
