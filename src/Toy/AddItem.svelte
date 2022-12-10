<script>
  import get from 'just-safe-get';
  import typeOf from 'just-typeof';
  import { slide } from 'svelte/transition';
  import { toyStore } from './toyStore.js';
  import Toggle from './Toggle.svelte';

  export let store;
  export let path = '';
  export let addItemsExpanded = false;
  export let inArray = false;
  export let show = false;

  let newKey;
  let newValue;
  let newType = 'string';
  let placeholder = '';
  let arrayTypeSet;

  // If in array, default to that existing array item type, but just once
  $: {
    if (inArray && !arrayTypeSet) {
      newType = typeOf(get($store, `${path}.0`));
      arrayTypeSet = true;
      show = show;
    }
  }

  $: {
    if (newType === 'number') {
      placeholder = 'Number Value';
    } else if (newType === 'object') {
      placeholder = 'like {a:1}';
    } else if (newType === 'array') {
      placeholder = 'like [1,2]';
    } else {
      placeholder = 'String Value';
    }
  }

  function handleAddItem() {
    console.log('addI');
    toyStore.updateExternalStore({
      store,
      path,
      value: newValue,
      key: newKey,
      type: newType,
      inArray,
    });
    newKey = newValue = '';
    newType = 'string';
    show = false;
    addItemsExpanded = false;
  }
</script>

{#if show}
  <div class="addItems" transition:slide>
    <select bind:value={newType}>
      {#each ['string', 'number', 'boolean', 'array', 'object'] as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
    <div class="addContainer">
      {#if !inArray && $store !== undefined && $store !== null}
        <input type="text" disabled={!newType} placeholder="Key" bind:value={newKey} />
        <span class="key">{': '}</span>
      {/if}
      {#if newType === 'boolean'}
        <Toggle {store} {path} bind:checked={newValue} />
      {:else if newType === 'number'}
        <input type="number" disabled={!newType} {placeholder} bind:value={newValue} />
        <!-- single {:else} breaks placeholder, but Redundancy works? -->
      {:else if newType === 'object'}
        <input type="text" disabled={!newType} {placeholder} bind:value={newValue} />
      {:else if newType === 'array'}
        <input type="text" disabled={!newType} {placeholder} bind:value={newValue} />
      {:else if newType === 'string'}
        <input type="text" disabled={!newType} {placeholder} bind:value={newValue} />
      {/if}
    </div>
    <button
      class="addItem"
      disabled={!newType ||
        (!inArray && !newKey && !store) ||
        (typeof $store === 'object' && Object.hasOwn($store, newKey)) ||
        !newValue}
      title={`Add to ${path || 'root'}`}
      on:click={handleAddItem}>Add</button>
  </div>
{/if}
{#if typeof $store === 'object' && $store !== undefined && $store !== null && Object.hasOwn($store, newKey)}
  <div class="key">Key '{newKey}' already exists, edit existing key instead.</div>
{/if}

<style>
  .addContainer {
    display: flex;
    align-items: center;
  }

  .addItems {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    margin: 5px 0;
  }

  input,
  select,
  button {
    margin: 0 4px;
    margin-left: 2px;
    font-family: 'MonoLisa', monospace;
    font-size: var(--state-tool-font-size);
    color: var(--toy-color-int);
    color: var(--toy-value-color);
    border: 0;
    border-radius: 1px;
    outline-offset: 1px;
    background: var(--toy-background-int);
    border: 1px solid var(--toy-value-color);
    border-radius: 3px;
  }

  input,
  button {
    width: 100%;
    padding: 0 4px;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  input::placeholder,
  select::placeholder {
    color: var(--toy-key-color);
  }

  button {
    border: 1px solid var(--toy-key-color);
    padding: 1px;
  }

  .key {
    color: var(--toy-value-color);
    opacity: 0.9;
    cursor: pointer;
  }
</style>
