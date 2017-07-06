
import Bunyan from 'bunyan';
const log = Bunyan.createLogger({name: 'testNamedDepCounter'});

import mocha from 'mocha';
import { expect } from 'chai';

import NamedDepCounter from '../src/named-dep-counter';

describe(`simple test NamedDepCounter`,
  ()=>{ 

    let namedDepCounter;
    let count; 
    let marked = false;
    let completed = false;

    const depsToMark = [ 
      "Sally",
      "Linus",
      "Chuck",
      "Lucy",
      "Five"
    ]
 
    it(`should create a new NamedDepCounter`,
      ()=>{ 
        namedDepCounter = new NamedDepCounter('Horace');
        expect(namedDepCounter.name()).to.equal('Horace');
      }
    );

    it(`should be able to reset the name`,
      ()=>{ 
        namedDepCounter.name('George');
        expect(namedDepCounter.name()).to.equal('George');
      }
    );

    it(`should be able to add a set of named Dependencies`,
      ()=>{ 
        namedDepCounter.dependencies(depsToMark);
        expect(namedDepCounter.dependencies()).to.deep.equal(depsToMark);
        expect(namedDepCounter.count()).to.equal(5);
        expect(namedDepCounter.remainingCount()).to.equal(5);
        expect(namedDepCounter.remaining()).to.deep.equal(depsToMark);
      }
    );


    it(`should be able to add a set of named Dependencies,
        but this time using the deps command. `,
      ()=>{ 
        namedDepCounter.deps(depsToMark);
        expect(namedDepCounter.deps()).to.deep.equal(depsToMark);
        expect(namedDepCounter.count()).to.equal(5);
        expect(namedDepCounter.remainingCount()).to.equal(5);

      }
    );

    it(`should be able to add an onComplete function`,
      ()=>{ 
        namedDepCounter.onComplete(
          (namedDepCounter)=>{ 
            completed = true;
          }
        );
      }
    );

    it(`should be able to mark the depCounter with names`,
      ()=>{ 
        namedDepCounter.mark("Lucy");
        namedDepCounter.mark("Linus");
        expect(namedDepCounter.current().length).to.equal(2);
        expect(namedDepCounter.currentCount()).to.equal(2);
        expect(namedDepCounter.remainingCount()).to.equal(3);
        expect(namedDepCounter.remaining().length).to.equal(3);
      }
    );

    it(`should be able to ignore an attempt to mark the depCounter 
        with a name that was already marked`,
      ()=>{ 
        namedDepCounter.mark("Lucy");
        expect(namedDepCounter.current().length).to.equal(2);
        expect(namedDepCounter.currentCount()).to.equal(2);
        expect(namedDepCounter.remainingCount()).to.equal(3);
        expect(namedDepCounter.remaining().length).to.equal(3); 
      }
    );
  }
);



