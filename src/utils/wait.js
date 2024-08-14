export const wait = (seconds) => {
    if (!seconds) throw Error('wait function did not receive any time!!');

    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
};
