<script lang="ts">
	import { contact } from '$lib/data/contact';
</script>

<section class="grid">
	<a href={`mailto:${contact.email}`}>{contact.email}</a>
	<a href={`tel:${contact.phone}`}>{contact.phone}</a>
	<a target="_blank" href="https://github.com/zeachco">Github/zeachco</a>
	<a target="_blank" href="https://www.linkedin.com/in/zeachco">LinkedIn/zeachco</a>
</section>

<style>
	section.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 0.75rem;
		margin-top: 2.5rem;
	}

	section.grid a {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.6em 1em;
		border: 1px solid var(--line);
		border-radius: 999px;
		color: var(--text-2);
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		text-decoration: none;
		transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
	}

	section.grid a:hover {
		color: var(--accent);
		border-color: var(--accent-line);
		background: var(--accent-soft);
	}

	@media print {
		section.grid {
			display: flex;
			justify-content: center;
			gap: 1.5rem;
			margin-top: 0.5rem;
		}

		section.grid a {
			border: none;
			padding: 0;
			color: #555;
		}
	}
</style>
