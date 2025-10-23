import { ILocalization } from "./interfaces/localization";
import { objectAsReadonly } from "../../utils/object";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
const localization: ILocalization = {
    chat: {
        header: {
            search: {
                placeholder: 'Поиск',
            }
        },
        messages: {
            message: {
                dialog: {
                    delete: {
                        title: 'Внимание',
                        message: 'Вы уверены, что хотите удалить сообщение?',
                        cancel: 'отменить',
                        delete: 'удалить',
                    },
                },
                contextMenu: {
                    menu: {
                        edit: 'редактировать',
                        cancel: 'отменить',
                        quote: 'цитировать',
                        delete: 'удалить',
                    },
                },
            }
        }
    },
    common: {

    },
};

export const ruRU = objectAsReadonly(localization);
