# NamedDepCounter (named-dep-counter)
#### Version 0.6.0 BETA

NamedDepCounter is a tool to keep track of a series of dependencies to be completed.  It can be used to track a series of tasks that need to be completed.

NamedDepCounter will track: 

* The number of total dependencies that need to be completed.
* The number of dependencies that have already been completed.
* The number of dependencies that need to be completed.

... **If that is all you need to do, look into (DepCounter)[https://npmjs.org/packages/dep_counter]**

NamedDepCounter will ALSO track: 

* The names of the dependencies that need to be completed.
* The names of the dependencies that have already been completed.
* The names of the dependencies that need to be completed.

#### Install: 

```
    npm install named-dep-counter
```

#### QuickStart: 

```
    import NamedDepCounter from 'named-dep-counter';
    const namedDepCounter = new NamedDepCounter('depCounterName');

    namedDepCounter.dependencies(['one', 'two', 'three']);
    // same as namedDepCounter.deps(['one', 'two', 'three']);
    console.log(namedDepCounter.ready()); // false
    console.log(namedDepCounter.current()); // [];
    console.log(namedDepCounter.currentCount()); // 0
    console.log(namedDepCounter.remaining()); // ['one', 'two', 'three'];
    console.log(namedDepCounter.remainingCount()); // 3

    namedDepCounter.mark('one');
    console.log(namedDepCounter.ready()); // false
    console.log(namedDepCounter.current()); // ['one'];
    console.log(namedDepCounter.currentCount()); // 1
    console.log(namedDepCounter.remaining()); // ['two', 'three'];
    console.log(namedDepCounter.remainingCount()); // 2

    namedDepCounter.mark('one'); // ignores this since 'one' was already marked.

    namedDepCounter.mark('two');
    namedDepCounter.mark('three');
    console.log(namedDepCounter.ready()); // true
    console.log(namedDepCounter.current()); // ['one', 'two', 'three'];
    console.log(namedDepCounter.currentCount()); // 3
    console.log(namedDepCounter.remaining()); // [];
    console.log(namedDepCounter.remainingCount()); // 0

```


#### Add some callbacks: 
```
    import NamedDepCounter from 'named-dep-counter';
    const namedDepCounter = new NamedDepCounter('namedDepCounterName');
    namedDepCounter.onComplete((namedDepCounter)=>console.log('DONE', namedDepCounter.ready()));
    namedDepCounter.onMark((namedDepCounter, key)=>console.log(`Mark! ${key}))

    namedDepCounter.mark('one');  // 'Mark! one'
    namedDepCounter.mark('one');  // NO EVENT
    namedDepCounter.mark('two');  // 'Mark! two'
    namedDepCounter.mark('three');  // 'Mark! three' & 'DONE true'

```

#### Alter the context for the callbacks with self command.
The first argument for every callback is 'self'.  By default, 'self'
is the instance of the NamedDepCounter itself.  You can override this if,
for instance you are nesting the NamedDepCounter inside another class instance.

```
    const namedDepCounter = new NamedDepCounter('fricassee');
    namedDepCounter.self({TYPE: 'SELFY'});
    namedDepCounter.onComplete((self)=>console.log(self.TYPE + '_complete'));
    namedDepCounter.deps(['a', 'b']);
    namedDepCounter.onMark((self, key)=>console.log(self.TYPE + key))
    namedDepCounter.mark('a'); // logs SELFY_a;
    namedDepCounter.mark('b'); // logs SELFY_b AND logs SELFY_complete
```

```
