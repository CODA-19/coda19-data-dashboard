/**
 * Resolves after _delayMs_ milliseconds
 * @param payload Return package.
 * @param delayMs Time to wait
 * @private
 */
export function resolveAfter(payload: any, delayMs: number) : Promise<any> {
    return new Promise(resolve => {
        setTimeout(() => resolve(payload), delayMs);
    });
}
