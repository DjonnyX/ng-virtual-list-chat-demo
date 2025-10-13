export const formatText = (str: string | undefined) => {
    if (!str) {
        return '';
    }

    let result = str;
    result = result.replaceAll(' ', '&nbsp;');
    result = result.replaceAll(/\r\n|\n|\r/gm, '<br>');
    return result;
};
