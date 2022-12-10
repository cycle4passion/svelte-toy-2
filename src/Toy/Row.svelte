<script>
  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';
  import Input from './Input.svelte';
  import Key from './Key.svelte';

  export let store;
  export let path;
  export let label = true;
  export let key;
  export let value;
  export let filter;
  export let array = { index: undefined, length: undefined };
  export let showComplex = true;
  export let inSettings;

  let addItemsState = {};
</script>

{#if value !== undefined}
  <!-- Array or Object -->
  {#if typeof value === 'object'}
    <Key
      {store}
      {key}
      {filter}
      {value}
      {label}
      {path}
      {inSettings}
      bounds={Array.isArray(value) ? ['[', ']'] : ['{', '}']}
      bind:showComplex
      bind:showAddItems={addItemsState[path]} />
    {#key showComplex}
      <div class="nested" transition:slide>
        {#if showComplex}
          {#each Object.entries(value) as [nestedKey, nestedValue], index (nestedKey)}
            <span class="line" animate:flip>
              <svelte:self
                {store}
                {filter}
                {inSettings}
                key={nestedKey}
                value={nestedValue}
                label={Array.isArray(value) ? false : true}
                path={`${path}.${nestedKey}`}
                array={Array.isArray(value)
                  ? { index: index, length: Object.keys(value).length }
                  : ''} />
            </span>
          {/each}
          <div class="key-like">{Array.isArray(value) ? ']' : '}'}</div>
        {/if}
      </div>
    {/key}
  {:else}
    <label class="st-container" for={path}>
      <Key
        {store}
        {inSettings}
        {filter}
        {label}
        {key}
        {value}
        {path}
        {array}
        bind:showAddItems={addItemsState[path]}
        bind:showComplex />
      {#key value}
        <Input {store} {inSettings} {path} {value} type={typeof value} />
      {/key}
    </label>
  {/if}
{/if}

<style>
  :global(.flash) {
    background: var(--toy-key-flash-bg);
    /* TODO: fix important requirement */
    color: var(--toy-key-flash-color) !important;
  }

  .nested {
    margin-left: var(--toy-nested-indent);
    margin-top: 3px;
    margin-bottom: 3px;
  }

  .st-container {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
    width: 100%;
    position: relative;
    margin-bottom: 2px;
    overflow: hidden;
  }

  .key-like {
    color: var(--toy-key-color);
    opacity: 0.9;
    cursor: pointer;
  }
</style>
