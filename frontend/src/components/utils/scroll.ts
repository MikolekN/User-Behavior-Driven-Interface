export const scrollToTop = (elemId?: string) => {
    const elem = document.getElementById(elemId ?? 'form-error-alert');
    if (elem) {
        elem.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
};
