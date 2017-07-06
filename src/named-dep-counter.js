

class NamedDepCounter { 

  constructor(name) { 
    this._name = name;
    this._deps = [];
    this._depsFulfilled = [];
    this._depsFulfilledIndex = {};
    this._depsIndex = {};
    this._count = -1;
    this._onComplete =()=>true;
  }

  count(count=false) { 
    return this._deps.length;
  }

  current() { 
    return this._depsFulfilled;
  }

  currentCount() { 
    return this._depsFulfilled.length;
  }

  deps(...p) { 
    return this.dependencies(...p);
  }

  dependencies(depList=null, append=false) { 
    if (depList === null) return this._deps;

    if (Array.isArray(depList) === false) { 
      switch(typeof depList) { 
        case 'object': 
          depList = Object.keys(depList);
        break;
        case 'string': 
          depList = [depList];
        break;
        default:
          throw new Error(
            `NamedDepCounter ${this._key} Error: 
             Tried to add invalid dependency list to counter.
             Please try again with types, object, array or string.`
          )
      }
    }

    
    const _l = depList.length;
    let i = 0;
    const adj = append === false ? 0 : this._deps.length;
    let depName;
    const deps = [];
    const depsIndex = {};
    for ( ; i !== _l; i++ ) { 
      depName = depList[i];
      deps[i] = depName;
      depsIndex[depName] = i + adj;
    }

    if (append === false) { 
      this._deps = deps;
      this._depsIndex = depsIndex;
      this._count = _l;
      this._remainingCount = _l;
      return
    }

    const currentDepsIndex = this._depsIndex;
    this._deps = this._deps.concat(deps);

    this._depsIndex = { ...currentDepsIndex, ...depsIndex };
    this._count+=_l;
    this._remainingCount = this._count - this._depsFulfilled.length;
  }

  mark(key) { 
    if (this._count === -1) return this._notReady();
    const ind = this._depsIndex[key]
    if (typeof ind === 'undefined') { 
      console.log(
        `NamedDepCounter ${this._key} Warning: 
         tried to mark a non-existent dependency ${key} as complete`
      );
      return false;
    }
    if (key in this._depsFulfilledIndex === true) return false;

    this._depsFulfilled.push(this._deps[this._depsIndex[key]]);
    this._depsFulfilledIndex[key] = true;
    this._remainingCount--;
    if (this._remainingCount === 0) return this._complete();
    return true;
  }

  name(name=null) { 
    if (name === null) return this._name;

    this._name = name;
  }

  ready() { 
    return this._remainingCount;
  }

  remaining() { 
    const { _depsFulfilled } = this;
    return this._deps.filter((dep)=>_depsFulfilled.indexOf(dep)===-1);
  };

  remainingCount() { 
    return this._count - this._depsFulfilled.length;
  }


  reset() { 
    this._remainingCount = this._deps.length;
    this._depsFulfilled = [];
    this._depsFulfilledIndex = {};
  }

  onComplete(callback) { 
    this._onComplete = callback;
  }

  onMark(callback) { 
    const mark = this.mark;
    this.mark = function(key) { 
      if (mark.call(this, key) === false) return;

      callback(this);
    }
  }

  _complete() { 
    this._onComplete(this);
  }

  _notReady() { 
    console.log(
      `NamedDepCounter ${this._key} is not ready.
       Please insert some dependency names with 
       NamedDepCounter.dependencies([array of dependencies]);`
    );
  }

}

export default NamedDepCounter;
