import { fromEvent, merge, interval, concat, race, forkJoin } from 'rxjs';
import { mapTo, startWith, take, map } from 'rxjs/operators';
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

isRunning$.subscribe((value) => { console.log('is running', value) })

