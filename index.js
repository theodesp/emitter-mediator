require('babel-register');

const Subject = require('rxjs/Rx').Subject;
const EventEmitter = require('events').EventEmitter;

export class ObservableEmitter extends EventEmitter {
  constructor(mediator, emitter = null) {
    super();
    this.emitter = emitter;
    this.mediator = mediator;

    this.tryMigrateEvents();
  }

  emit(event, ...args) {
    return this.mediator.emit(event, ...args);
  }

  addListener(event, listener) {
    return this.on(event, listener);
  }

  on(event, listener) {
    this.mediator.register(event, listener);
    return this;
  };

  tryMigrateEvents() {
    if (this.emitter && this.emitter.eventNames().length > 0) {
      const events = Object.assign({}, this.emitter._events); // copy handlers

      if (Object.keys(events).length > 0) {
        this.emitter.eventNames().forEach(type => {
          const evListener = events[type];

          if (typeof evListener === 'function') {
            this.mediator.register(type, evlistener);
          } else if (evListener) { // array
            evListener.forEach(listener => {
              this.mediator.register(type, listener);
            });
          }
        });

        this.emitter.removeAllListeners(); // Clean up callbacks to prevent side-effects
      }

    }
  }
}

export class EmitterMediator {
  constructor() {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  emit(type, ...args) {
    let subscriber, error;
    let doError = (type === 'error');
    let events = this._events;

    if (doError) {
      if (args.length > 1) {
        error = arguments[1];
      }
      if (error instanceof Error) {
        throw error; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        let err = new Error('Uncaught, unspecified "error" event. (' + error + ')');
        err.context = error;
        throw err;
      }
    }

    subscriber = events[type];
    if (!subscriber)
      return false;

    switch (args.length) {
      case 0:
        subscriber.next();
        break;
      case 1:
        subscriber.next(args[0]);
        break;
      default:
        subscriber.next(args);
    }

    return true;
  }

  _register(target, type, listener) {
    let events = target._events;
    let existing = events[type];

    if (!existing) {
      events[type] = new Subject();

      events[type].subscribe(listener);
      ++target._eventsCount;
    } else {
      existing.subscribe(listener);
    }

    return this;
  }

  register(event, listener) {
    return this._register(this, event, listener)
  }
}
