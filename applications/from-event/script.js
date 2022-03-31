import { fromEvent } from 'rxjs';

const addMessageButton = document.getElementById('create-notification');
const deleteMessageButton = document.getElementById('delete-notification');
const notificationMessages = document.getElementById('notification-messages');

const createNotificationElement = () => {
  const element = document.createElement('article');
  element.innerText = 'Something happened.';
  return element;
};

const addMessageToDOM = () => {
  const notification = createNotificationElement();
  notificationMessages.appendChild(notification);
};

const deleteMessageFromDom = () => {
  const element = document.querySelector('article');
  if (element) {
    notificationMessages.removeChild(element);
  }
}

/**
 * Your mission:
 *
 * - Use `fromEvent` to create an observable that streams click events.
 * - Subscribe to that observable.
 * - Use `addMessageToDOM` to add a useless message to the DOM whenever the
 *   stream emits a value.
 */

const buttonClicks$ = fromEvent(addMessageButton, 'click');

buttonClicks$.subscribe(addMessageToDOM);
buttonClicks$.subscribe((e) => console.log(e))

const deleteButtonClicks$ = fromEvent(deleteMessageButton, 'click');

deleteButtonClicks$.subscribe(deleteMessageFromDom)
deleteButtonClicks$.subscribe((e) => console.log(e))
