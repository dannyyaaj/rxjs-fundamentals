import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { switchMap, mapTo, scan } from 'rxjs/operators';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));

const counter$ = merge(start$, pause$).pipe(
  switchMap((shouldIBeRunning) => {
    if (shouldIBeRunning) {
      return interval(1000)
    } else {
      return NEVER;
    }
  }),
  scan((total) => total + 1, 0),
);

counter$.subscribe(setCount);
