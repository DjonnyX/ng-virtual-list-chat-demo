export const formatTime = (dateTime: number) => {
    if (dateTime) {
        return Intl.DateTimeFormat(undefined, {
            timeStyle: 'short',
        }).format(dateTime);
    }
    return undefined;
};