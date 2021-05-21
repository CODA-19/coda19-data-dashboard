export function isValidPanelId(id: string) : boolean {
    // For Panel 1 through 12, with prefix P.
    return id.match(/^p[1-9][012]?$/) !== null;
}

export function isValidDate(dateStr: string) : boolean {
    return dateStr.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
}