<script>
  import { toyStore } from './toyStore';
  export let trueLabel = 'TRUE';
  export let falseLabel = 'FALSE';

  export let store;
  export let path;
  export let checked = false;
</script>

<label class="toggle no-select">
  <input
    class="toggle-checkbox"
    type="checkbox"
    bind:checked
    on:change={() =>
      toyStore.updateExternalStore({ store, path, value: checked, type: 'boolean' })} />
  <div class="toggle-switch" />
  <span class="toggle-label key-like no-select">{checked ? trueLabel : falseLabel}</span>
</label>

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    padding-left: 10px;
    cursor: pointer;
  }
  .toggle-switch {
    display: inline-block;
    position: relative;
    background: var(--toy-key-color);
    border-radius: 7px;
    width: 22px;
    height: 10px;
    vertical-align: middle;
    transition: background-color 0.25s;
  }
  .toggle-switch:before,
  .toggle-switch:after {
    content: '';
  }
  .toggle-switch:before {
    display: block;
    background: linear-gradient(to bottom, #fff 0%, #eee 100%);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    width: 8px;
    height: 8px;
    position: absolute;
    top: 1px;
    left: 2px;
    transition: left 0.25s;
  }
  .toggle:hover .toggle-switch:before {
    background: linear-gradient(to bottom, #fff 0%, #fff 100%);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  }
  .toggle-checkbox:checked + .toggle-switch {
    background: var(--toy-value-color);
  }
  .toggle-checkbox:checked + .toggle-switch:before {
    left: 12px;
  }
  .toggle-checkbox {
    position: absolute;
    visibility: hidden;
  }
  .toggle-label {
    position: relative;
    color: var(--toy-value-color);
    margin-left: 5px;
    top: 1px;
  }
</style>
