# EmitterMediator

Decouple EventEmitter events from senders and receivers using a mediator.

# What? Why?
Sometimes you want to have an Emitter that sends only events and in some
other part of your application you want a handler that handles the events.
The traditional EventEmitter has all the eggs in one basket.

If you want something more clean and decoupled you can use this module.
You only need to wrap your events to an ObservableEmitter passing 
an instance of EmitterMediator that will act as a bus of all your 
event listeners.

Internally the ObservableEmitter passes all eventEmitter calls to 
the mediator.

The mediator uses Rx.Subject observables
 to add subscriptions to events bases on the topic.


# What you get
* Creates an "intermediary" that decouples "senders" from "receivers"
* Producer emitters are coupled only to the Mediator.
* Consumer emitters are coupled only to the Mediator.
* The Mediator arbitrates the events storing and handler dispatching.
* You can pass existing EventEmitters to the Mediator.Their existing

# testing




# example

Case1: Using an existing EventEmitter. The original EventEmitter 
<em>degaussed</em> thus will have no listeners.

``` js
var emitter1 = new events.EventEmitter();
emitter.on('data', function (data) {
  console.log('Data: ' + data);
});

emitter1.once('data', function (data) {
  console.log('Data: ' + data);
});

var emitter2 = new events.EventEmitter();
emitter2.on('data', function (data) {
  console.log('Data: ' + data);
});

emitter2.once('data', function (data) {
  console.log('Data: ' + data);
});

// Use or reuse a mediator here
var mediator = new EmitterMediator();

// Hook the emitters in an ObservableEmitter
// ObservableEmitter is an EventEmitter itself
var emitterA = new ObservableEmitter(emitter1, mediator);
var emitterB = new ObservableEmitter(emitter2, mediator);
// emitter1 and emitter2 will have no listeners but all 
their existing ones will be available on subsequent calls

// Just a producer
var producer = new ObservableEmitter(mediator);

emitterA.on('data', (data) => {
  console.log(data)
});
emitterB.on('data', (data) => {
  console.log(data)
});

producer.emit('data', [1, 2, 3]);
producer.emit('data', [1, 2, 3, 4]);



```


Case2: Stand alone

``` js

// Use or reuse a mediator here
var mediator = new EmitterMediator();

// ObservableEmitter is an EventEmitter itself
var emitterA = new ObservableEmitter(mediator);
var emitterB = new ObservableEmitter(mediator);

// Just a producer
var producer = new ObservableEmitter(mediator);

emitterA.on('data', (data) => {
  console.log(data)
});
emitterB.on('data', (data) => {
  console.log(data)
});

producer.emit('data', [1, 2, 3]);
producer.emit('data', [1, 2, 3, 4]);

```

Case3: Error

``` js

producer.emit('error', [1,2,3]) // throws error

```
