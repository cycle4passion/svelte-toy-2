<script>
  import { fade } from 'svelte/transition';
  import get from 'just-safe-get';
  import set from 'just-safe-set';
  import typeOf from 'just-typeof';
  import { toyStore, pauseFlash, settingsTitles } from './toyStore.js';
  import AddItem from './AddItem.svelte';

  export let store;
  export let inSettings;
  export let path;
  export let label;
  export let key;
  export let value;
  export let showAddItems = false;
  export let array = { index: undefined, length: undefined };
  export let bounds = [];
  export let showComplex;
  export let filter;

  let keyRef;
  let cached;
  let arrow = '▼';
  let ellipse = `...`;

  function flash() {
    if ($pauseFlash) return;
    keyRef?.classList.add('flash');
    setTimeout(() => keyRef?.classList.remove('flash'), 2500);
  }

  function doPauseFlash() {
    $pauseFlash = true;
    // since pauseFlash will need to persist for all keys, can't handle in flash itself else 1st key resets it.
    setTimeout(() => ($pauseFlash = false), 500);
  }

  $: {
    if (keyRef && $toyStore.flashUpdates && !inSettings) {
      // flash for matching keys/values
      if (
        (filter && key?.toLowerCase().includes(filter.toLowerCase())) ||
        (filter && JSON.stringify(value)?.toLowerCase().includes(filter.toLowerCase()))
      ) {
        flash();
      }

      //  use of cached prevents flash on first render
      if (cached === undefined) {
        cached = value;
      } else if (cached !== value && typeof cached === typeof value) {
        // flash for updates; typeof neede to prevent TRUE === "1" from filter
        flash();
        cached = value;
      }
    }
  }

  async function clipboardCopy(content) {
    if (content) {
      content = typeof content === 'function' ? content : JSON.stringify(content);
      content = content.replace(/"(.*)"/, '$1');
      try {
        await navigator.clipboard.writeText(content);
      } catch (e) {
        console.log(`Error: ${e.message}.`);
      }
    }
  }

  function moveInArray(by) {
    let newData;
    store.update(u => {
      newData = { ...u };
      let arrPath = path.replace(/\.\d+$/, '');
      let arr = get(newData, arrPath);
      let other = arr[array.index + by];
      arr[array.index] = other;
      arr[array.index + by] = value;
      set(newData, arrPath, arr);
      return newData;
    });
  }
</script>

<span
  class="key-like"
  class:complexStart={bounds.length}
  title={inSettings
    ? settingsTitles[key]
    : `Double Click to Copy: [${typeOf(value).toUpperCase()}]\n${JSON.stringify(value)}`}
  on:dblclick|stopPropagation={() => clipboardCopy(value)}>
  {#if $toyStore.advancedEdit && !inSettings}
    <button
      class="deleteItem"
      title={`Delete ${path}`}
      on:click={() => {
        doPauseFlash();
        toyStore.updateExternalStore({
          store,
          path,
          key: array.index,
          value: null,
          type: null,
          inArray: !!array,
        });
      }}>
      X</button>
    {#if array.length}
      <button
        class="move"
        title="Move Up"
        disabled={array.index === 0}
        on:click={() => moveInArray(-1)}>⬆</button>
      <button
        class="move"
        title="Move Down"
        disabled={array.index === array.length - 1}
        on:click={() => moveInArray(1)}>⬇</button>
    {/if}
  {/if}
  {#if label}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="key" bind:this={keyRef} on:click={() => (showComplex = !showComplex)}>
      {label ? `${key}: ` : ``}
    </span>
  {/if}
  {#if bounds.length}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      class="complexArrow"
      title={`Click to ${showComplex ? 'Collapse' : 'Expand'} ${key}`}
      class:expanded={!showComplex}
      on:click={() => {
        showComplex = !showComplex;
        showAddItems = !showComplex ? false : showAddItems;
      }}>{arrow}</span>
    <span class="startBounds">{bounds[0]}</span>
    {#if !showComplex}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span
        class="ellipse"
        title={`Click to Expand ${key}`}
        in:fade={{ delay: 100 }}
        on:click={() => (showComplex = true)}>{ellipse}</span
      >{bounds[1]}
    {/if}
  {/if}
  {#if $toyStore.advancedEdit && bounds.length}
    <button class="addItem" title={`Add to ${path}`} on:click={() => (showAddItems = !showAddItems)}
      >{showAddItems ? '-' : '+'}</button>
  {/if}
</span>
<AddItem {store} {path} inArray={bounds[0] === '['} bind:show={showAddItems} />

<style>
  :global(.flash) {
    background: var(--toy-key-flash-bg);
    color: var(--toy-key-flash-color) !important;
  }

  .complexArrow {
    display: inline-block;
    color: var(--toy-value-color);
    transform: rotate(0turn);
    transition: 0.4s transform ease-in-out;
  }

  :global(.complexArrow.expanded) {
    transform: rotate(-90deg);
  }

  .complexStart {
    display: block;
  }

  .ellipse {
    color: var(--toy-value-color);
    cursor: pointer;
    padding-right: 5px;
  }

  .addItem,
  .deleteItem,
  .move {
    visibility: hidden;
    background: var(--toy-lowlight);
    color: var(--toy-value-color);
    border: 1px solid var(--toy-key-color);
    border-radius: 2px;
    padding: 0px 2px;
    font-size: var(--state-tool-font-size);
  }

  .move {
    margin-left: -3px;
    font-size: 0.8em;
  }

  .move:disabled {
    visibility: hidden !important;
  }

  .key {
    padding: 0 2px;
    border-radius: 2px;
    align-self: flex-start;
  }

  .key-like {
    color: var(--toy-key-color);
    opacity: 0.9;
    cursor: pointer;
  }

  :global(
      .key-like:hover .addItem,
      .key-like:hover .deleteItem,
      .st-container:hover .addItem,
      .st-container:hover .deleteItem,
      .st-container:hover .move
    ) {
    visibility: visible;
  }

  :global(.key-like > .key > .startBounds) {
    display: inline-block;
  }
</style>
