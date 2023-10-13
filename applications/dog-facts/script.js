import { fromEvent, of, timer, merge, NEVER } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
  exhaust,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

// const endpoint = 'http://localhost:3333/api/facts?delay=2000&chaos=true&flakiness=0';
const endpoint = 'http://localhost:3333/api/facts';

const fetchData = () => {
  return fromFetch(endpoint).pipe(
    tap(clearError),
    //mergeMap will take in every click and fetch API
    //exhaustMap will take only the first click and ignore future clicks until API call is successful
    //switchMap will only take latest click value to make API call
    mergeMap(response => {
      if (response.ok) {
        return response.json()
      } else {
        // return of({ error: 'Something went wrong.' })
        throw new Error('Something went wrong. ')
      }
    }),
    retry(4),
    catchError((error) => {
      return of({ error: error.message })
    })
  )
}

// take an event, map it into a promise from a fetch and show it to the UI
const fetch$ = fromEvent(fetchButton, 'click').pipe(mapTo(true))
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false))

const factStream$ = merge(fetch$, stop$).pipe(
  switchMap(shouldFetch => {
    if (shouldFetch) {
      return timer(0, 5000).pipe(
        tap(() => clearError()),
        tap(() => clearFacts()),
        exhaustMap(fetchData)
      )
    } else {
      return NEVER
    }
  })
)

factStream$.subscribe(addFacts)

// // exhaustMap(fetchData),


factStream$.subscribe(({ facts, error }) => {
  if (error) {
    return setError(error)
  }
  addFacts({ facts })
})

//have a fetch situation where it will catch error and display on UI, it will retry fetch, take that and set it to work on a timer
