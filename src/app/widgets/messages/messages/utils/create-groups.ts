import { IVirtualListItem } from "@shared/components/x-virtual-list";
import { MessageTypes } from "@shared/enums";
import { ILocalization } from "@shared/localization";
import { IMessage } from "@widgets/messages";
import { IGetMessagesData } from "@widgets/messages/model/messages";

const sortByDateTime = (a: IVirtualListItem<IMessage>, b: IVirtualListItem<IMessage>) => {
    if (a.dateTime > b.dateTime) {
        return 1;
    }
    if (a.dateTime < b.dateTime) {
        return -1;
    }
    return a.type === MessageTypes.GROUP && b.type !== MessageTypes.GROUP ? -1 : 0;;
}

export const createGroups = (list: IGetMessagesData, locale: string, localization: ILocalization): IGetMessagesData => {
    const result: IGetMessagesData = {
        items: [],
        version: list.version,
    };

    const items = list.items.sort(sortByDateTime);
    let currentDate: Date | undefined;
    for (let i = 0, l = items.length; i < l; i++) {
        const item = { ...items[i] }, dateTime = item.dateTime, d = new Date(dateTime), date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        item.type = MessageTypes.ITEM;
        if (!currentDate || currentDate != date) {
            currentDate = date;
            const dayFormat = Intl.DateTimeFormat(locale).format(date), isTooday = dayFormat === Intl.DateTimeFormat(locale).format(new Date());
            let text = '';
            if (isTooday) {
                text = localization.common.date.tooday;
            } else {
                text = dayFormat;
            }
            const dateItem: IVirtualListItem<IMessage> = {
                version: 0,
                id: date.getTime(),
                dateTime: date.getTime(),
                text,
                type: MessageTypes.GROUP,
            };
            result.items.push(dateItem);
        }
        result.items.push(item);
    }
    return result;
}