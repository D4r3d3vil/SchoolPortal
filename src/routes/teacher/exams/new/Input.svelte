<script>
    import { fly } from 'svelte/transition';
  
    export let value = '';
  
    const select = (v) => {
      if (v === 0 && !value) return;
      if (value.length >= 6) return;
  
      value += v;
    };
  </script>
  
  <form in:fly={{ y: -10, delay: 120 }} on:submit|preventDefault>
    <button type="button" on:click={() => select(1)}>
      1
    </button>
    <button type="button" on:click={() => select(2)}>
      2
    </button>
    <button type="button" on:click={() => select(3)}>
      3
    </button><br>
    <button type="button" on:click={() => select(4)}>
      4
    </button>
    <button type="button" on:click={() => select(5)}>
      5
    </button>
    <button type="button" on:click={() => select(6)}>
      6
    </button><br>
    <button type="button" on:click={() => select(7)}>
      7
    </button>
    <button type="button" on:click={() => select(8)}>
      8
    </button>
    <button type="button" on:click={() => select(9)}>
      9
    </button><br>
    <button type="button" on:click={() => select(10)}>
      0
    </button>
  </form>
  
<style>
  
</style>