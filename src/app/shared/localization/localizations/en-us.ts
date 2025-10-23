import { ILocalization } from "./interfaces/localization";
import { objectAsReadonly } from "../../utils/object";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
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
