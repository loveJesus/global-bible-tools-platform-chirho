<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import '../app.css';
	import type { LayoutData as LayoutDataChirho } from './$types';

	let { children, data }: { children: any; data: LayoutDataChirho } = $props();
</script>

<svelte:head>
	<title>Global Bible Tools</title>
	<meta name="description" content="Collaborative Bible translation platform" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="bg-white border-b border-slate-200">
		<div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-6">
				<a href="/" class="text-xl font-bold text-slate-900">Global Bible Tools</a>
				<nav class="hidden sm:flex gap-4">
					<a href="/read-chirho" class="text-slate-600 hover:text-slate-900">Read</a>
					<a href="/translate-chirho" class="text-slate-600 hover:text-slate-900">Translate</a>
				</nav>
			</div>
			<div class="flex items-center gap-4">
				{#if data.userChirho}
					<span class="text-sm text-slate-600">{data.userChirho.nameChirho ?? data.userChirho.emailChirho}</span>
					<a href="/logout-chirho" class="text-sm text-slate-600 hover:text-slate-900">Logout</a>
				{:else}
					<a href="/login-chirho" class="text-sm text-blue-600 hover:text-blue-700">Login</a>
				{/if}
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="bg-slate-100 border-t border-slate-200 py-6">
		<div class="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
			Global Bible Tools - Collaborative Bible translation platform
		</div>
	</footer>
</div>
