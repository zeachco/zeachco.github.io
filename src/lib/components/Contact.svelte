<script lang="ts">
	import {contact} from '../data/contact'
</script>
<div>
	<h1>{contact.name}</h1>
	<h2><a href={`mailto:${contact.email}`}>{contact.email}</a> | <a href={`telto:${contact.phone}`}>{contact.phone}</a></h2>
</div>

<style>
    div {
		text-align: center;
		position: relative;
		padding: 0 1em 0 1em;
		margin: 0;
		border-bottom-left-radius: 1em;
		background: var(--background);
		background-size: contain;
    }
</style>
