import { fromEvent, merge, interval, concat, race, forkJoin, combineLatest } from 'rxjs';
import { mapTo, startWith, take, map, tap, combineLatestWith } from 'rxjs/operators';
import {
  labelWith,
  startButton,
  pauseButton,
  setStatus,
  bootstrap,
  clearButton,
} from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true))
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false))

//give it default value of false before anything is emitted
const isRunning$ = merge(start$, pause$).pipe(startWith(false))

isRunning$.subscribe(setStatus)

const first$ = interval(1000).pipe(map(labelWith('First')), take(4));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));
// const combined$ = combineLatest(first$, second$).pipe(tap(([first, second]) => console.log(first, second)))
const combined$ = first$.pipe(combineLatestWith(second$), tap(([first, second]) => console.log(first, second)))

bootstrap({ first$, second$, combined$ })
