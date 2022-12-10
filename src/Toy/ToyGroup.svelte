<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { toyStore } from './toyStore.js';
  import AddItem from './AddItem.svelte';
  import Row from './Row.svelte';

  export let store;
  export let label;
  export let isSectionOpen = false;
  export let filter = '';

  let chevron = '▼';
  let displayedPrior = false;
  let addItemsExpanded = false;
  let showComplex = true;

  $: inSettings = label === 'SVELTE-TOY SETTINGS';

  let storeKV;
  $: {
    if ($store) {
      storeKV = Object.entries($store).filter(
        ([k, v]) =>
          !filter ||
          k.toString().toLowerCase().includes(filter.toLowerCase()) ||
          v.toString().toLowerCase().includes(filter.toLowerCase()) ||
          (typeof v === 'object' && JSON.stringify(v).toLowerCase().includes(filter.toLowerCase())),
      );
      if ($toyStore.autoExpand && filter) {
        isSectionOpen = storeKV.length !== 0;
        showComplex = storeKV.length !== 0;
      }
    }
  }

  onMount(() => {
    // prevent autoexpansion on first render
    return store.subscribe(() => {
      isSectionOpen = $toyStore.autoExpand && displayedPrior ? true : isSectionOpen;
      displayedPrior = true;
    });
  });

  async function clipboardCopy(content) {
    if (content) {
      content = typeof content === 'function' ? content : JSON.stringify(content);
      try {
        await navigator.clipboard.writeText(content);
      } catch (e) {
        console.log(`Error: ${e.message}.`);
      }
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<h4
  class:isSectionOpen
  on:click|self={() => {
    if ($store) isSectionOpen = !isSectionOpen;
  }}>
  <div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      class="chevron"
      class:isSectionOpen
      on:click|self={() => {
        if ($store) isSectionOpen = !isSectionOpen;
      }}>{chevron}</span>
    <span
      on:click|self={() => {
        if ($store) isSectionOpen = !isSectionOpen;
      }}>
      {label}
    </span>
    {#if !inSettings}
      <em
        title={`Double Click to Copy "${label}" Store\n\n${JSON.stringify($store, null, 2)}`}
        on:dblclick={() => clipboardCopy($store)}>ℹ</em>
      <em
        class="xx-small"
        title={`${label} Store Methods\n\n${Object.entries(store)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')}`}>fx</em>
      {#if !$store}<span class="xx-small">(Empty)</span>{/if}
    {/if}
  </div>
  {#if inSettings}
    <div class="sizers">
      <span class="sizeUp" on:click={() => $toyStore.pxFontSize++}>{chevron}</span><span
        class="sizeDown"
        on:click={() => $toyStore.pxFontSize--}>{chevron}</span>
    </div>
  {:else if $toyStore.advancedEdit && (typeof $store === 'object' || $store === null || $store === undefined)}
    <button
      class="addRootItemButton"
      title={`Add to ${label}`}
      on:click|stopPropagation={() => {
        isSectionOpen = true;
        addItemsExpanded = !addItemsExpanded;
      }}>{addItemsExpanded ? '-' : '+'}</button>
  {/if}
</h4>
{#if isSectionOpen}
  <div class="state-mang-data" transition:slide>
    {#if addItemsExpanded && $toyStore.advancedEdit}
      <AddItem {store} path={''} bind:show={addItemsExpanded} />
    {/if}
    {#if typeof $store === 'object'}
      {#each storeKV as [key, value]}
        <Row {store} path={key} {key} {value} {filter} {showComplex} {inSettings} />
      {/each}
    {:else}
      <Row
        {store}
        {inSettings}
        path={label}
        key={label}
        value={$store}
        label={false}
        {showComplex}
        {filter} />
    {/if}
  </div>
{/if}

<style>
  .state-mang-data {
    /* Why assymetric? */
    padding: 5px 15px 5px 5px;
  }

  .xx-small {
    font-size: 0.8em;
  }

  h4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border-bottom: solid 1px var(--toy-lowlight);
    border-top: solid 1px var(--toy-highlight);
    box-shadow: var(--level-2, 0 2px 3px rgba(0, 0, 0, 0.1), 0 1px 5px rgba(0, 0, 0, 0.13));
    background: var(--toy-header-bg);
    color: var(--toy-header-color, --toy-color);
    font-family: 'MonoLisa', monospace;
    font-size: 1.5em;
    text-transform: capitalize;
    padding: 4px 6px;
    margin: 0;
    cursor: pointer;
  }

  .chevron {
    display: inline-block;
    transition: 0.2s transform ease-in-out;
    transform: rotate(-90deg);
  }

  .sizers {
    display: inline-flex;
  }

  .sizeUp {
    margin: 0 5px;
    transform: rotate(180deg);
  }

  .sizeDown {
    transform: rotate(0deg);
  }

  :global(.chevron.isSectionOpen) {
    /* work on removing !important */
    transform: rotate(0deg) !important;
  }

  .addRootItemButton {
    visibility: hidden;
    right: 10px;
    background: var(--toy-header-bg);
    color: var(--toy-key-color);
    font-size: var(--state-tool-font-size);
    border: 1px solid var(--toy-value-color);
    border-radius: 2px;
    padding: 0 2px;
    z-index: 2002;
  }

  h4:hover .addRootItemButton {
    visibility: visible;
  }
</style>
