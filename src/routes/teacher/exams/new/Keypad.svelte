<script>
    import { createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';
    import Input from './Input.svelte';
  
    const dispatch = createEventDispatcher();
  
    let value;
  
    $: time = getTime(value);
    $: timeMarkup = Object.entries(time)
      .map(([a, b]) => `${b}<span>${a}</span>`)
      .join(' ');
  
    function getTime(v = '') {
      const [h, m, s] = v
        .padStart(6, '0')
        .replace(/(\d{2})/g, '$1:')
        .split(':');
      return { h, m, s };
    }
  
    function handleSubmit() {
      const { h, m, s } = time;
      const countdown = [s, m, h].reduce(
        (acc, curr, i) => acc + parseInt(curr, 10) * 60 ** i,
        0
      );
      dispatch('countdown', countdown);
    }
  </script>
  
  <header in:fly={{ y: -5 }}>
    <h1 class:translucent={!value}>
      {@html timeMarkup}
    </h1>
    <Input bind:value on:submit={handleSubmit} />
    <button
      disabled={!value}
      on:click={() => {
        value = value.slice(0, -1);
      }}
    >
      <svg viewBox="-50 -50 100 100" width="1em" height="1em">
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M -46 0 l 28 -32 h 64 v 64 h -64z" />
          <path d="M 3 -11 l 22 22 m -22 0 l 22 -22" />
        </g>
      </svg>
    </button>
  </header>
  
  