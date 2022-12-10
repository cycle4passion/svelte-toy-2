<script>
  import { toyStore } from './toyStore.js';
  import Toggle from './Toggle.svelte';

  export let store;
  export let inSettings;
  export let path;
  export let value;
  export let type;

  let comma = `,`;
  let quote = `"`;
  let input;

  // escape HMTL so contenteditable div does not CSSify it
  $: if (type === 'string') value = value.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
</script>

{#if type === 'boolean'}
  <Toggle {store} {path} checked={value} />
{:else}
  {#if type === 'string'}
    <span class="quote starting">{quote}</span>
  {/if}
  <span
    bind:this={input}
    class="input value"
    class:empty={!value}
    contenteditable="true"
    spellcheck="false"
    on:focus={e => window.getSelection().selectAllChildren(e.currentTarget)}
    on:keypress={e => {
      if (!/^\d+|\.$/.test(e.key) && type === 'number') e.preventDefault();
    }}
    on:blur={() => toyStore.updateExternalStore({ store, path, value, type })}
    bind:innerHTML={value} />
  {#if type === 'string'}
    <span class="quote ending">{quote}</span>
  {/if}
  {#if typeof $store === 'object' && !inSettings}<span class="comma">{comma}</span>{/if}
{/if}

<style>
  .input {
    display: inline-block;
    max-width: 100%;
    font-family: 'MonoLisa', monospace;
    background: var(--toy-background-int);
    color: var(--toy-value-color);
    margin: 0 5px;
    outline-offset: 2px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  /* When !value, input needs room to be clicked */
  .input.empty {
    padding: 0 2px;
  }

  .input:focus {
    /* padding: 1px; */
    /* margin-top: 5px; */
    /* margin-bottom: 5px; */
    /* border-radius: 1px; */
    /* outline: 1px solid var(--toy-key-color); */
    /* No padding/outline prevents expansion on focus, but not accessible. Uncommenting above accesible, but causes jumping */
    /* best alternative was to select all on focus making more noticable, but still not a18y */
    outline: 0;
    white-space: normal;
    overflow: visible;
  }

  .quote,
  .comma {
    color: var(--toy-key-color);
    font-style: italic;
  }

  .quote.starting {
    margin-right: -3px;
  }

  .quote.ending {
    margin-left: -5px;
    margin-right: 5px;
  }

  .comma {
    align-self: flex-end;
    margin: 0 -2px 0 -4px;
  }
</style>
