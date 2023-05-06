<script lang="ts">
	import { contact } from '$lib/data/contact';
</script>

<section class="grid">
	<a href={`mailto:${contact.email}`}>{contact.email}</a>
	<a href={`tel:${contact.phone}`}>{contact.phone}</a>
	<a href="https://github.com/zeachco">Github/zeachco</a>
	<a href="https://www.linkedin.com/in/zeachco">LinkedIn/zeachco</a>
</section>
