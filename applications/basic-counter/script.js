import { fromEvent, interval, merge, NEVER, switchMap, scan, mapTo, tap } from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true))
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false))

//when user clicks start (true), timer will increment by 1 second until user clicks pause (false)
const counter$ = merge(start$, pause$).pipe(
  tap((value) => console.log(value)),
  switchMap((shouldIBeRunning) => {

    if (shouldIBeRunning) {
      return interval(1000)
    } else {
      return NEVER;
    }
  }),
  //will take current counter and increment, instead of always starting back at 0
  scan((total) => total + 1, 0)
)

//sets innerText of div with class count
counter$.subscribe(setCount)
