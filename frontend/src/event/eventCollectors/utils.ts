export const getPageNameWithoutUrlIdentifiers = (url: string): string => {
    if (!url.includes('edit')) {
        return url;
    }
    // adds starting '/' for url and takes second item after split
    return "/" + url.split('/')[1];
}