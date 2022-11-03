import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subject,
  timer,
} from 'rxjs';
import {
  catchError,
  delay,
  filter,
  finalize,
  map,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

export interface MyData {
  id: number;
  label: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroySubject = new Subject<void>();
  private destroyed$ = this.destroySubject.asObservable();

  initialMessages$: Observable<string[]>;
  newMessages$: Observable<string[]>;
  allMessages$: Observable<string[]>;
  clearChatSubject = new Subject<void>();

  ngOnInit() {
    this.initialMessages$ = this.getInitialMessages();
    this.newMessages$ = this.getNewMessages();
    //   const initialMessages$: Observable<string[]> = this.chatRestService.getMessages$(this._chatRoomId);
    //   const newMessages$: Observable<string[]> = this.shatSocketService.getMessageEvents$(this._chatRoomId).pipe(
    //     startWith([])
    //   );

    // this.messages$ = initialMessages$.pipe(
    //   concatMap(initialMessages => {
    //     return this.clearChatSubject.asObservable().pipe(map(reset => reset ? [] : initialMessages))
    //   }),
    //   switchMap(initialMessages => {
    //     return newMessages$.pipe(
    //       map(newMessages => initialMessages.concat(newMessages)),
    //       tap(mergedMessages => initialMessages = mergedMessages)
    //     )
    //   })
    //);
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  clearChat() {
    this.clearChatSubject.next();
  }

  // Simulate remote queries
  private getInitialMessages(): Observable<string[]> {
    return of(['init message 1', 'init message 2', 'init message 3']).pipe(
      delay(1000) // Simulate delay from backend
    );
  }

  private newMessageNumber: number = 1;
  private getNewMessages(): Observable<string[]> {
    return timer(1000, 2000).pipe(
      map(() => $`new message ${this.newMessageNumber++}`)
    );
  }
}
