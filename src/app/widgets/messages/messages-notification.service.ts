import { Observable } from "rxjs";

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