import { Observable } from "rxjs";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2025 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 * Only for personal (Evgenii Alexandrovich Grebennikov djonnyx@gmail.com tg: http://t.me/djonnyx) use.
 * All rights reserved.
 */
export abstract class MessagesNotificationService {
    /**
     * version
     */
    abstract $messages: Observable<number>;

    /**
     * userId
     */
    abstract $writing: Observable<number>;
}