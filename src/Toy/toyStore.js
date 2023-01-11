import get from 'just-safe-get';
import set from 'just-safe-set';
import { writable } from 'svelte/store';

function omit(obj, propsArg) {
  // Note offical "just-omit" does not support nested paths (https://github.com/angus-c/just#just-omit), and lodash omit is huge
  // This is minor change to just-set now performs nested path omits (Issue https://github.com/angus-c/just/issues/518)
  var props, lastProp;
  if (Array.isArray(propsArg)) {
    props = propsArg.slice(0);
  }
  if (Array.isArray(propsArg)) {
    props = propsArg.slice(0);
  }
  if (typeof propsArg == 'string') {
    props = propsArg.split('.');
  }
  lastProp = props.pop();
  if (!lastProp) {
    return false;
  }
  var thisProp;
  while ((thisProp = props.shift())) {
    if (typeof obj[thisProp] == 'undefined') {
      obj[thisProp] = {};
    }
    obj = obj[thisProp];
    if (!obj || typeof obj != 'object') {
      return false;
    }
  }
  if (Array.isArray(obj)) {
    obj.splice(parseInt(lastProp), 1);
  } else {
    delete obj[lastProp];
  }
  return true;
}

function _toyStore(init) {
  const {
    subscribe,
    set: svelteSet,
    update,
  } = writable(init, () => {
    // on setup, runs after first subscriber
    let unsubscribeLS = toyStore.subscribe(val =>
      localStorage.setItem('toyStore', JSON.stringify(val)),
    );

    return () => {
      // on teardown, runs after last subscriber unsubscribes
      unsubscribeLS();
    };
  });

  return {
    subscribe,
    set: svelteSet,
    update,
    updateExternalStore: ({
      store,
      path = '',
      key = '',
      value,
      type = 'string',
      inArray = false,
    }) => {
      //console.table({ path, key, value, type, inArray });
      if (type === 'number') value = parseFloat(value);
      if (type === 'object')
        value = JSON.parse(value.replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":'));
      if (type === 'array') value = JSON.parse(value);
      // unescape HTML before writing back to store
      if (type === 'string') value = value.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      store.update(u => {
        let newData = { ...u };
        if (typeof u !== 'object') {
          // Is !key needed?
          /* Simple Store */
          newData = value;
        } else {
          if (type === null) {
            omit(newData, path);
          } else {
            if (inArray && !key) key = get(u, path).length;
            let newpath = `${path}${key ? (path ? '.' : '') + key : ''}`;
            set(newData, newpath, value);
          }
        }
        return newData;
      });
    },
  };
}

let init = {
  flashUpdates: true,
  advancedEdit: true,
  autoExpand: true,
  hotKeys: true,
  pxFontSize: 12,
  sortByKey: true,
};

export let settingsTitles = {
  flashUpdates: 'Store keys are highlighted when values update and when keys/values match filter.',
  autoExpand:
    'Filtered, or updated store values cause their store section containing the store to be auto-expanded.',
  advancedEdit:
    'Enables advanced editing of store values. Supports add/remove items, as well as reordering arrays.',
  hotKeys:
    'Enables hotkeys for common actions. Ctrl-S: show/hide Svelte-Toy, Ctrl-E: expand/collapse all stores, Ctrl-F: go to filter.',
  pxFontSize: 'Sets the font size in pixels for the store data.',
  sortByKey: 'Stores can be sorted alphabetically by key (easier to find in larger stores',
};

export let pauseFlash = writable(false);
export let toyStore = _toyStore(JSON.parse(localStorage.getItem('toyStore')) || init);
