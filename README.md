# Svelte-Toy-2  

Current Svelte-Toy Repo is not working so cannot create a pull request, seems to be packaging issue for side-menu. This represents a pretty extensive rewrite of svelte-toy trying to stay true to the original with detailed documentation of Fixes, Changes, and New functionality. As requested, it is updated to use Angus just set - https://www.npmjs.com/package/just-safe-set/v/2.2.0?activeTab=readme instead of much larger lodash.set. Hopefully this can be merged.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/cycle4passion/svelte-toy-2?file=README.md)
  
  ## Changes
  * CHANGE: brought side-menu into this package as temporary fix. Tried not to change the side-menu package as it is expected that it will return to an import. 
  noted changes:
    FIX: changed scale for sideMenu.active from 1.05 to 1 to prevents cascasding overflow issues.
    NEW: added no-select CSS for nub
  * FIX: previously empty stores (store = writable()) would crash the app
  * FIX: custom var (--ease-in-out=quint) was never defined, as such no animation of section chevron click, just hardcoded transition
  * CHANGE: in <Row> changed value display to include {:else} as fallthrough to handle more types (string, function, etc).
  * CHANGE: renamed isOpen to isSectionOpen to be more clear
  * CHANGE: Extracted out new Component <Key>. It was used many times/redundant
  * CHANGE: Extracted out <Input> 
  * CHANGE: replaced input with contenteditable div, allowing for expansion focus, ellipsis on overflow-y, handles HTML, limits to numbers when type number
  * CHANGE: Within <Row> combined similar code of display of Arrays and Objects for code simplification
  * CHANGE: updateStore function is now a custom store method (toyStore.updateExternalStores) imported rather than prop drilling. 
          It's as used in both <Input> and <Key>, send value="null" to delete
  * CHANGE: removed simple prop and required prop drilling, now determined in where needed by typeof store === 'object'
  
  ## MAJOR NEW FUNCTIONALITY
  * NEW: Now uses Angus just-safe-set as well as get. Major difference, arrays handled like a.1 instead of a[1]
  * NEW: optional Toy component param openOnLoad allowing for inital store to be one based on order of register param <Toy register={{ store, simple, empty }} openOnLoad={[0,1]}> would open store and simple on load.
  * NEW: Added support to optional Advanced Editing: CRUD - add/delete store items and reorder store arrays
  * NEW: Filter stores by key and/or value with optional auto-expand/collapse store sections, and clear button for filter
  * NEW: Can collapse objects and arrays to single line
  * NEW: Optional: <Toy openOnLoad={[0, 1]} /> prop to open sections on load based upon index
  * NEW: Optional: Key label temporarily highlighted when store items are updated with optional auto-expand section containing updated item
  * NEW: Optional: Hotkey access to toggle Sidemenu (ctrl-s)
  * NEW: Optional: HotKey access to toggle expand/collapse all stores (ctrl-e)
  * New: Optional: HotKey access to open Toy if closed, and focus within search (ctrl-f)
  * NEW: Added $toyStore store for settings and it syncs with localStorage for persistence.  Hover over thier keys gives tooltip explanation. Up/Down chevrons adjust global font size.
      $toyStore.flashUpdates: Store keys are highlighted when values update and when keys/values match filter.
      $toyStore.autoExpand: Filtered, or updated store values cause their store section containing the store to be auto-expanded.
      $toySrore.advancedEdit: Enables advanced editing of store values. Supports add/remove items, as well as reordering arrays.
      $toyStore.hotKeys: Enables hotkeys for common actions. Ctrl-S: show/hide Svelte-Toy, Ctrl-E: expand/collapse all stores, Ctrl-F: go to filter.
      $toySTore.pxFontSize: Sets the font size in pixels for the store data.
      $toyStore.updateExternalStore method. allows to update and delteing external store keys.
      %toyStore.sortByKey allows optional alphabetic sort of a stores keys.
  ## MINOR NEW FUNCTIONALITY
  * NEW: more transitions and animations
  * NEW: Added decorative [] for arrays and {} for objects
  * NEW: Added decorative commas
  * NEW: Added decorating quotes for strings, calls attention to their type
  * NEW: Custom <Toggle> component replacing native checkboxes, checkboxes were visually jarring as unthemed
  * NEW: added CSS custom vars --toy-nested-indent, --toy-key-flash-color, --toy-key-flash-bg
  * NEW: Within store header, Hover over 'i' shows whole store, and Doubleclick on 'i' will copy entire store's value to clipboard
  * NEW: Within store header, Hover over 'fx' in header shows store methods
  * NEW: Hover over a store's individual value and it displays the entire value without focusing (useful for long strings which have been overflow hidden)
  * NEW: Hover over a key a shows values type, informs of double click option to copy that item's value to clipboard
  * NEW: Applied no-select CSS to all keys, values, and store headers, preventing accidental selection when trying to double click, etc

  *** STILL TODO
  * TODO: CSS: in serious need CSS cleanup, renaming css vars, currently using  state-mang/toy/sidebar, and get confusing.
  * TODO: CSS: up/down chevrons for adjusting pxFontSize in Settings header not vertically aligned
  * TODO: CSS: <ToyGroup>:147 more selectivity for chevron to avoid !important, I think problem stems from being within :global(), failed :global(h4 span.chevron.isSectionOpen)
  * TODO: CSS: custom/themed vertical srollbar would be nice. its smaller size beneficial too.
  * TODO: CSS: size of toggle doesn't adjust to $toyStore.pxFontSize, implementation a little bit of a CSS nightmare.
  * TODO: CSS: Clear button on filter on vertically aligned with changing font-sizes
  * TODO: CSS: in <Key> the +/- button seen while hovering at root of objects/arrays, changes sizes depending on + or -, force width = height so basing off var(--state-tool-font-size) to fix?
  * TODO: needs support for Sets, current shows empty object, breaks on additions, will need iteration for display and custom handling add(), delete()
  * TODO: <Input>:30 contenteditable div uses on:blur to update store, but this is not ideal, on:input would be better but loses focus after 1st keystroke. Maybe some other way of binding?
  * TODO: <Row>:45 flip animation for array move/reorder works for some but not all arrays, not sure why (compArr move 2 up animates, but move 8 up does not.)
  * TODO: animations have some jank, see opening "Store" store and collpasing of complexObj
  * TODO: flashing implementation still has some quirks false/positives
  * TODO: chevron font sizing causes settings to open <ToyGroup>: 91 and 92
  * TODO: EmptyObj set to {} should not be expandable