<script>
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { linear as easing } from 'svelte/easing';
    import { fly } from 'svelte/transition';
  
    const dispatch = createEventDispatcher();
  
    export let countdown;
  
    let now = Date.now();
    let end = now + countdown * 1000;
  
    $: count = Math.round((end - now) / 1000);
    $: h = Math.floor(count / 3600);
    $: m = Math.floor((count - h * 3600) / 60);
    $: s = count - h * 3600 - m * 60;
  
    function updateTimer() {
      now = Date.now();
    }
  
    let interval = setInterval(updateTimer, 1000);
    $: if (count === 0) clearInterval(interval);
  
    let isPaused;
    let isResetting;
    const duration = 1000;
  
    let offset = tweened(1, { duration, easing });
    let rotation = tweened(360, { duration, easing });
  
    $: offset.set(Math.max(count - 1, 0) / countdown);
    $: rotation.set((Math.max(count - 1, 0) / countdown) * 360);
  
    function handleNew() {
      clearInterval(interval);
      dispatch('new');
    }
  
    function handleStart() {
      now = Date.now();
      end = now + count * 1000;
      interval = setInterval(updateTimer, 1000);
      offset.set(Math.max(count - 1, 0) / countdown);
      rotation.set((Math.max(count - 1, 0) / countdown) * 360);
      isPaused = false;
    }
  
    function handlePause() {
      offset.set(count / countdown);
      rotation.set((count / countdown) * 360);
      clearInterval(interval);
      isPaused = true;
    }
  
    function handleReset() {
      clearInterval(interval);
      isResetting = true;
      isPaused = false;
      Promise.all([offset.set(1), rotation.set(360)]).then(() => {
        isResetting = false;
        now = Date.now();
        end = now + countdown * 1000;
        interval = setInterval(updateTimer, 1000);
      });
    }
  
    function padValue(value, length = 2, char = '0') {
      const { length: currentLength } = value.toString();
      if (currentLength >= length) return value.toString();
      return `${char.repeat(length - currentLength)}${value}`;
    }
  
    onDestroy(() => {
      clearInterval(interval);
    });
  </script>