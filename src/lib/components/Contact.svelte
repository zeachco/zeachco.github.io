<script lang="ts">
	import {contact} from '../../lib/data/data'
</script>
<div>
	<h2>{contact.name}</h2>
	<h2>{contact.email} | {contact.phone}</h2>
</div>

<style>
    div {
        text-align: right;
        float: right;

		position: relative;
		padding: 0 1em 0 1em;
		margin: 0;
		background: var(--background);
		background-size: contain;
    }
</style>
