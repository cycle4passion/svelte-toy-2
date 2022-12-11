<script>
  import Toy from './Toy/Toy.svelte';

  let store = writable({
    boolean: true,
    string: 'string',
    html: '<p>paragraph</p>',
    longString: 'This is a ver long string of text to wrap multiple lines so check it out',
    number: 1,
    obj: { a: 1, b: 2 },
    arr: [1, 2, 3],
    complexObj: { a: 1, b: { d: 2 }, c: 3 },
    compArr: [1, [7, 8, 9], 2, 3, 4],
    function: () => console.log('fx'),
    empty: '',
  });
  let simple = writable('simple');
  let emptyObj = writable({});
  let _null = writable();

  import { writable } from 'svelte/store';
</script>

<Toy
  register={{ store, simple, emptyObj, _null }}
  theme="dark"
  isToyActive={true}
  openOnLoad={[0]} />

<input bind:value={$store.html} />
<div>
  <pre>{JSON.stringify($store, null, 2)}</pre>
  <pre>{JSON.stringify($simple, null, 2)}</pre>
  <pre>{JSON.stringify($emptyObj, null, 2)}</pre>
  <pre>{JSON.stringify($_null, null, 2)}</pre>
</div>

<style>
  div {
    color: white;
    font-size: x-small;
    margin: 10px;
  }

  /* .state-example {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
    background: grey;
  } */
</style>
