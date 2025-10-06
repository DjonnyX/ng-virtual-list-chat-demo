import { Observable } from "rxjs";

export abstract class MessagesNotificationService {
    abstract $messages: Observable<number>;
}