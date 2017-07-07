'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NamedDepCounter = function () {
  function NamedDepCounter(name) {
    _classCallCheck(this, NamedDepCounter);

    this._name = name;
    this._deps = [];
    this._depsFulfilled = [];
    this._depsFulfilledIndex = {};
    this._depsIndex = {};
    this._count = -1;
    this._onComplete = function () {
      return true;
    };
  }

  /**
   * Show the number of dependencies to be marked complete
   * @return {uint}
   */


  _createClass(NamedDepCounter, [{
    key: 'count',
    value: function count() {
      return this._deps.length;
    }

    /**
     * Show the dependencies that have been fulfilled
     * @return {array} the names of the fulfilled dependecies.
     */

  }, {
    key: 'current',
    value: function current() {
      return this._depsFulfilled;
    }

    /**
     * show the number of dependencies that have been fulfilled
     * @return {uint}
     */

  }, {
    key: 'currentCount',
    value: function currentCount() {
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

  }, {
    key: 'deps',
    value: function deps() {
      return this.dependencies.apply(this, arguments);
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

  }, {
    key: 'dependencies',
    value: function dependencies() {
      var depList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (depList === null) return this._deps;

      if (Array.isArray(depList) === false) {
        switch (typeof depList === 'undefined' ? 'undefined' : _typeof(depList)) {
          case 'object':
            depList = Object.keys(depList);
            break;
          case 'string':
            depList = [depList];
            break;
          default:
            throw new Error('NamedDepCounter ' + this._key + ' Error: \n             Tried to add invalid dependency list to counter.\n             Please try again with types, object, array or string.');
        }
      }

      var _l = depList.length;
      var i = 0;
      var adj = append === false ? 0 : this._deps.length;
      var depName = void 0;
      var deps = [];
      var depsIndex = {};
      for (; i !== _l; i++) {
        depName = depList[i];
        deps[i] = depName;
        depsIndex[depName] = i + adj;
      }

      if (append === false) {
        this._deps = deps;
        this._depsIndex = depsIndex;
        this._count = _l;
        this._remainingCount = _l;
        return;
      }

      var currentDepsIndex = this._depsIndex;
      this._deps = this._deps.concat(deps);

      this._depsIndex = _extends({}, currentDepsIndex, depsIndex);
      this._count += _l;
      this._remainingCount = this._count - this._depsFulfilled.length;
    }

    /**
     * mark a named dependency as complete
     * @param  {string} key
     * @return {Boolean} true is a dep is marked, false if 
     * the dep was already marked or does not exist.
     */

  }, {
    key: 'mark',
    value: function mark(key) {
      if (this._count === -1) return this._notReady();
      var ind = this._depsIndex[key];
      if (typeof ind === 'undefined') {
        console.log('NamedDepCounter ' + this._key + ' Warning: \n         tried to mark a non-existent dependency ' + key + ' as complete');
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

  }, {
    key: 'name',
    value: function name() {
      var _name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (_name === null) return this._name;

      this._name = _name;
    }

    /**
     * are all the deps complete?
     * @return {Boolean} true if complete, false if otherwise.
     */

  }, {
    key: 'ready',
    value: function ready() {
      return this._remainingCount === 0;
    }

    /**
     * Show the list of deps waiting to be marked complete.
     * @return {array} 
     */

  }, {
    key: 'remaining',
    value: function remaining() {
      var _depsFulfilled = this._depsFulfilled;

      return this._deps.filter(function (dep) {
        return _depsFulfilled.indexOf(dep) === -1;
      });
    }
  }, {
    key: 'remainingCount',


    /**
     * show number of deps waiting to be completed.
     * @return {uint}
     */
    value: function remainingCount() {
      return this._count - this._depsFulfilled.length;
    }

    /**
     * mark all dependencies as NOT complete.. reset all counts.
     * @return {null}
     */

  }, {
    key: 'reset',
    value: function reset() {
      this._remainingCount = this._deps.length;
      this._depsFulfilled = [];
      this._depsFulfilledIndex = {};
    }

    /**
     * add a callback to be run when all the deps are complete
     * @param  {Function} callback 
     * @return {null}
     */

  }, {
    key: 'onComplete',
    value: function onComplete(callback) {
      this._onComplete = callback;
    }

    /**
     * add a callback to be run when a dep is marked complete.
     * @param  {Function} callback
     * @return {null}
     */

  }, {
    key: 'onMark',
    value: function onMark(callback) {
      var mark = this.mark;
      this.mark = function (key) {
        if (mark.call(this, key) === false) return;

        callback(this, key);
      };
    }

    /**
     * run when all deps are complete
     * @private
     * @return {null}
     */

  }, {
    key: '_complete',
    value: function _complete() {
      this._onComplete(this);
    }

    /**
     * run when this NamedDepCounter is not ready 
     * and mark was called.
     * @return {null}
     */

  }, {
    key: '_notReady',
    value: function _notReady() {
      console.log('NamedDepCounter ' + this._key + ' is not ready.\n       Please insert some dependency names with \n       NamedDepCounter.dependencies([array of dependencies]);');
    }
  }]);

  return NamedDepCounter;
}();

exports.default = NamedDepCounter;
//# sourceMappingURL=named-dep-counter.js.map