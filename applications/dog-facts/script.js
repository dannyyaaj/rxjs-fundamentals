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

const endpoint = 'http://localhost:3333/api/facts?delay=2000&chaos=true&flakiness=1';

// take an event, map it into a promise from a fetch and show it to the UI
const fetch$ = fromEvent(fetchButton, 'click').pipe(
  //mergeMap will take in every click and fetch API
  //exhaustMap will take only the first click and ignore future clicks until API call is successful
  //switchMap will only take latest click value to make API call
  exhaustMap(() => {
    return fromFetch(endpoint).pipe(
      tap(clearError),
      mergeMap(response => {
        if (response.ok) {
          return response.json()
        } else {
          // return of({ error: 'Something went wrong.' })
          throw new Error('Something went wrong. ')
        }
      }),
      retry(4)
    )
  }),
  catchError((error) => {
    // console.error(error)
    return of({ error: error.message })
  })
)

fetch$.subscribe(({ facts, error }) => {
  if (error) {
    return setError(error)
  }
  clearFacts()
  addFacts({ facts })
})
