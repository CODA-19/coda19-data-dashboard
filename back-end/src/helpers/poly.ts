import fs from "fs";

/**
 * Get random integer in [min, max)
 * @param min Inclusive Minimum
 * @param max Exclusive Maximum
 */
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/**
 * Generic cache type (should match Express app)
 */
export interface AppCache {
    get(key: string): any;
    set(key: string, data: any): void;
}

/**
 * Gets (and set if missing) the content of a file on the FS
 * @param app Express app.
 * @param path Path to the file.
 */
export function getCachedFile(app: AppCache, path: string) : string {
    let txt = app.get(path);
    if (txt === undefined) {
        txt = fs.readFileSync(path);
        app.set(path, txt);
    }
    return txt;
}
