import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  startWith,
  Subject,
  timer,
  withLatestFrom,
} from 'rxjs';
import {
  catchError,
  delay,
  filter,
  finalize,
  map,
  mergeScan,
  scan,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  initialMessages$: Observable<string[]>;
  newMessages$: Observable<string[]>;
  allMessages$: Observable<string[]>;
  isStopped$: Observable<boolean>;

  private readonly clearChatSubject = new Subject<void>();
  private readonly clearChat$ = this.clearChatSubject.asObservable();
  private readonly destroySubject = new Subject<void>();
  private readonly destroyed$ = this.destroySubject.asObservable();

  ngOnInit() {
    this.initialMessages$ = this.getInitialMessages().pipe(
      startWith([]),
      takeUntil(this.destroyed$)
    );

    this.newMessages$ = this.getNewMessages().pipe(
      startWith([]),
      shareReplay(),
      takeUntil(this.destroyed$)
    );

    this.allMessages$ = combineLatest([
      this.initialMessages$,
      this.newMessages$,
    ]).pipe(
      map(([initMessages, newMessages]) => [...initMessages, ...newMessages]),
      takeUntil(this.destroyed$)
    );

    // Automatically stop the streams
    setTimeout(() => this.destroySubject.next(), 10000);
    this.isStopped$ = this.destroyed$.pipe(map(() => true));
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
      delay(2000) // Simulate delay from backend
    );
  }

  private newMessageNumber: number = 1;
  private getNewMessages(): Observable<string[]> {
    return timer(1000, 2000).pipe(
      map(() => [`new message ${++this.newMessageNumber}`]),
      scan((acc, curr) => {
        return [...curr, ...acc];
      }, [])
    );
  }
}
