import { Observable } from "rxjs";

/**
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
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