export const getPageNameWithoutUrlIdentifiers = (url: string): string => {
    const splittedUrl = url.split('/');
    //console.log(splittedUrl);
    const urlWithoutIdentifiers = "/" + splittedUrl[1];

    console.log(urlWithoutIdentifiers)
    return urlWithoutIdentifiers;
}