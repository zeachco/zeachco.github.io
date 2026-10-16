<script lang="ts">
	import { projects, moreProjects } from '$lib/data/projects';
	import PageTransition from '$lib/components/PageTransition.svelte';
</script>

<svelte:head>
	<title>Projects | Olivier Rousseau-Guyot</title>
	<meta
		name="description"
		content="Original projects by Olivier Rousseau-Guyot: browser neural-network games, Rust trading tools, WASM simulations and Node utilities."
	/>
	<meta property="og:title" content="Projects | Olivier Rousseau-Guyot" />
	<meta
		property="og:description"
		content="Original projects by Olivier Rousseau-Guyot: browser neural-network games, Rust trading tools, WASM simulations and Node utilities."
	/>
	<meta property="og:url" content="https://www.olivier-rousseau-guyot.com/projects" />
</svelte:head>

<section>
	<PageTransition pathname="projects">
		<h1>Projects</h1>
		<div class="project-list">
			{#each projects as project}
				<article class="project" class:flagship={project.flagship}>
					<h3>
						<a target="_blank" rel="noopener" href={project.href}>{project.name}</a>
					</h3>
					<p>{project.description}</p>
				</article>
			{/each}
		</div>
		<p class="more">
			More on
			<a href="https://github.com/zeachco?tab=repositories">GitHub</a>:
			{#each moreProjects as repo}
				<a target="_blank" rel="noopener" href={`https://github.com/zeachco/${repo}`}>{repo}</a
				>{', '}
			{/each}
		</p>
	</PageTransition>
</section>

<style>
	.project-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
		gap: 1rem;
	}

	.project {
		border: 1px solid var(--line);
		border-radius: var(--radius-card, 12px);
		padding: 1rem 1.25rem;
		background: var(--card-background-color, transparent);
	}

	.project.flagship {
		border-color: var(--accent-line, var(--line));
	}

	.project h3 {
		margin: 0 0 0.4rem;
		font-size: 1.05rem;
	}

	.project p {
		margin: 0;
		color: var(--text-2);
		font-size: 0.92rem;
	}

	.project a {
		color: var(--accent);
	}

	.project a:hover {
		color: var(--accent-2);
	}

	.more {
		color: var(--text-2);
		font-size: 0.9rem;
	}
</style>
