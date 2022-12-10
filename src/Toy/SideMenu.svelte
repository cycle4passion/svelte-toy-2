<script>
  export let top = `10px`;
  export let active = false;
  export let right = false;
  export let theme = '';
  export let nub = '🚀';
  export let links = [
    {
      text: 'How To Use',
    },
    {
      path: '/please',
      text: 'Please',
    },
    {
      path: '/link-to',
      text: 'Add `links` prop',
    },
    {
      path: '/link-to',
      text: 'to populate the menu',
    },
  ];
</script>

<div class={`side-menu ${theme}`} class:active class:right style={`--sm-top: ${top}`}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="nub no-select" on:click={() => (active = !active)}>{nub}</div>
  <div class="side-menu-content">
    <nav>
      {#each links as link}
        {#if link.path}
          <a href={link.path}>{link.text}</a>
        {:else}
          <h4>{link.text}</h4>
        {/if}
      {/each}
    </nav>
    <slot />
  </div>
</div>

<style>
  .side-menu {
    --toy-top-position: var(--sm-top, 0);
    --toy-color-int: var(--toy-color, rgba(51, 51, 51, 1));
    --toy-background-int: var(--toy-bg, white);
    --toy-header-bg: rgba(242, 242, 242, 1);
    font-family: var(--toy-font-family, sans-serif);
    transition: transform 0.2s var(--ease_in_out_quint, cubic-bezier(0.83, 0, 0.17, 1));
    transform: translate3d(100%, 0, 0);
    position: fixed;
    top: var(--sm-top);
    bottom: 100vh;
    right: 0;
    width: var(--toy-width, 300px);
    z-index: var(--toy-z, 2001);
  }

  .side-menu.active {
    transform: translate3d(0, 0, 0) scale(1);
  }
  .side-menu .nub {
    border-bottom: solid 1px var(--toy-lowlight);
    border-right: solid 1px var(--toy-lowlight);
    border-top: solid 1px var(--toy-highlight);
    border-radius: 5px 0 0 5px;
    box-shadow: var(
      --level-4,
      -6px 14px 28px rgba(0, 0, 0, 0.1),
      -6px 10px 10px rgba(0, 0, 0, 0.12)
    );
    position: absolute;
    padding: 10px;
    right: 100%;
    top: 20px;
    background: var(--toy-nub-bg, var(--toy-header-bg));
  }
  .dark {
    --toy-color: rgba(204, 204, 204, 1);
    --toy-header-color: rgba(204, 204, 204, 1);
    --toy-background-int: rgba(36, 36, 41, 1);
    --toy-nub-bg: var(--toy-background-int);
    --toy-highlight: rgba(64, 64, 64, 1);
    --toy-lowlight: rgba(13, 13, 13, 1);
    --toy-header-bg: rgba(26, 26, 26, 1);
  }
  .exp {
    --toy-color: rgba(255, 255, 255, 1);
    --toy-header-color: #a8fe39;
    --toy-background-int: rgba(12, 12, 14, 1);
    --toy-nub-bg: var(--toy-background-int);
    --toy-highlight: rgba(38, 38, 38, 1);
    --toy-lowlight: rgba(13, 13, 13, 1);
    --toy-header-bg: #191324;
    --toy-font-family: monospace;
    --level-4: 0px 0px 17px #000 inset, 10px 10px 71px #000 inset;
  }
  .side-menu-content {
    border-left: solid 1px var(--toy-highlight);
    box-shadow: var(--level-4, 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22));
    background: var(--toy-background-int);
    color: var(--toy-color-int);
    overflow: hidden;
    max-height: calc(100vh - var(--toy-top-position));
    overflow-y: auto;
    border-radius: 5px 0 0 5px;
    padding-bottom: 200px;
    box-sizing: border-box;
  }
  h4 {
    border-bottom: solid 1px var(--toy-lowlight);
    border-top: solid 1px var(--toy-highlight);
    box-shadow: var(--level-2, 0 2px 3px rgba(0, 0, 0, 0.1), 0 1px 5px rgba(0, 0, 0, 0.13));
    text-transform: capitalize;
    padding: 4px 6px;
    cursor: pointer;
    font-size: var(--toy-heading-font-size, 12px);
    margin: 0;
    background: var(--toy-header-bg);
    color: var(--toy-header-color, --toy-color);
  }
  a {
    display: block;
    padding: 10px;
    color: var(--toy-color);
  }

  .nub:hover {
    cursor: pointer;
  }
</style>
