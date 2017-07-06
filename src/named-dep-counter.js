

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

  /**
   * Show the number of dependencies to be marked complete
   * @return {uint}
   */
  count() { 
    return this._deps.length;
  }

  /**
   * Show the dependencies that have been fulfilled
   * @return {array} the names of the fulfilled dependecies.
   */
  current() { 
    return this._depsFulfilled;
  }

  /**
   * show the number of dependencies that have been fulfilled
   * @return {uint}
   */
  currentCount() { 
    return this._depsFulfilled.length;
  }

  /**
   * get or set the dependencies for this 
   * NamedDepCounter.  <br>
   * If getting, ALL dependencies will be shown
   * regardless of whether or not they are fulfilled.
   * <br>
   * If setting, you can choose to merge the new 
   * dependencies with any existing ones or to overwrite
   * any existing dependencies with the new ones you are setting.
   * 
   * @param  {Array | String | Object | null} 
   *          depList the deps to be set.  If null.. return existing deps
   * 
   * @param {Boolean} append.  If true, append these else overwrite.
   * @return {Array | null} if getting, the list of dependencies.. else null
   */
  deps(...p) { 
    return this.dependencies(...p);
  }

  /**
   * get or set the dependencies for this 
   * NamedDepCounter.  <br>
   * If getting, ALL dependencies will be shown
   * regardless of whether or not they are fulfilled.
   * <br>
   * If setting, you can choose to merge the new 
   * dependencies with any existing ones or to overwrite
   * any existing dependencies with the new ones you are setting.
   * 
   * @param  {Array | String | Object | null} 
   *          depList the deps to be set.  If null.. return existing deps
   * 
   * @param {Boolean} append.  If true, append these else overwrite.
   * @return {Array | null} if getting, the list of dependencies.. else null
   */
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

  /**
   * mark a named dependency as complete
   * @param  {string} key
   * @return {Boolean} true is a dep is marked, false if 
   * the dep was already marked or does not exist.
   */
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

  /**
   * set or get the name of this namedDepCounter
   * @param  {string | null} name
   * @return {null | string} null if setting, string if getting.
   */
  name(name=null) { 
    if (name === null) return this._name;

    this._name = name;
  }

  /**
   * are all the deps complete?
   * @return {Boolean} true if complete, false if otherwise.
   */
  ready() { 
    return this._remainingCount === 0;
  }

  /**
   * Show the list of deps waiting to be marked complete.
   * @return {array} 
   */
  remaining() { 
    const { _depsFulfilled } = this;
    return this._deps.filter((dep)=>_depsFulfilled.indexOf(dep)===-1);
  };

  /**
   * show number of deps waiting to be completed.
   * @return {uint}
   */
  remainingCount() { 
    return this._count - this._depsFulfilled.length;
  }

  /**
   * mark all dependencies as NOT complete.. reset all counts.
   * @return {null}
   */
  reset() { 
    this._remainingCount = this._deps.length;
    this._depsFulfilled = [];
    this._depsFulfilledIndex = {};
  }

  /**
   * add a callback to be run when all the deps are complete
   * @param  {Function} callback 
   * @return {null}
   */
  onComplete(callback) { 
    this._onComplete = callback;
  }

  /**
   * add a callback to be run when a dep is marked complete.
   * @param  {Function} callback
   * @return {null}
   */
  onMark(callback) { 
    const mark = this.mark;
    this.mark = function(key) { 
      if (mark.call(this, key) === false) return;

      callback(this, key);
    }
  }

  /**
   * run when all deps are complete
   * @private
   * @return {null}
   */
  _complete() { 
    this._onComplete(this);
  }

  /**
   * run when this NamedDepCounter is not ready 
   * and mark was called.
   * @return {null}
   */
  _notReady() { 
    console.log(
      `NamedDepCounter ${this._key} is not ready.
       Please insert some dependency names with 
       NamedDepCounter.dependencies([array of dependencies]);`
    );
  }

}

export default NamedDepCounter;
