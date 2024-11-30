export const scrollToTop = (elemId: string) => {
    const elem = document.getElementById(elemId);
    if (elem) {
        elem.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
};
