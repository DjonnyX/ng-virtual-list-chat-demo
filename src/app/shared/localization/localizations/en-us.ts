import { ILocalization } from "./interfaces/localization";
import { objectAsReadonly } from "../../utils/object";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export const localization: ILocalization = {
    chat: {
        header: {
            search: {
                placeholder: 'Search',
            }
        },
        messages: {
            message: {
                dialog: {
                    delete: {
                        title: 'Attention',
                        message: 'Are you sure you want to delete the message?',
                        cancel: 'cancel',
                        delete: 'delete',
                    },
                },
                contextMenu: {
                    menu: {
                        edit: 'edit',
                        cancel: 'cancel',
                        quote: 'quote',
                        delete: 'delete',
                    },
                },
            }
        }
    },
    common: {

    },
};

export const enUS = objectAsReadonly(localization);
