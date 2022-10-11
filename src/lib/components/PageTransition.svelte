<script>
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

    $: pathname = $page.url.pathname || ''
    let oldpathname = pathname;

    onMount(() => {
        console.log(`mount ${$page.url.pathname}`)
    })

    onDestroy(() => {
        console.log(`destroy ${$page.url.pathname}`)
    })

    function anim(el:HTMLDivElement, data = {x=0, duration=0,delay=0}) {
        console.log(el, data)
    }
</script>

{#key pathname}
	<div in:anim={{ x: -5, duration: 500, delay: 500 }} out:anim={{ x: 5, duration: 500 }}>
		<slot />
	</div>
{/key}
