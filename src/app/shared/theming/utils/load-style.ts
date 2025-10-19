export const loadStyle = (styleName: string) => {
    return new Promise<void>((resolve, reject) => {
        const head = document.getElementsByTagName('head')[0],
            themeLink = document.getElementById(
                'theme'
            ) as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = `${styleName}?dt=${Date.now()}`;
            themeLink.onload = (e) => {
                resolve();
            };
            themeLink.onerror = (e) => {
                reject();
            };
        } else {
            const style = document.createElement('link');
            style.id = 'theme';
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = `${styleName}?dt=${Date.now()}`;
            style.onload = (e) => {
                resolve();
            };
            style.onerror = (e) => {
                reject();
            };

            head.appendChild(style);
        }
    });
}