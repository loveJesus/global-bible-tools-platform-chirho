<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { enhance as enhanceChirho } from '$app/forms';
</script>

<svelte:head>
	<title>Logout - Global Bible Tools</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-lg shadow-md p-8 text-center">
			<h1 class="text-2xl font-bold text-slate-900 mb-4">Logout</h1>
			<p class="text-slate-600 mb-6">Are you sure you want to log out?</p>

			<form method="POST" use:enhanceChirho class="space-y-4">
				<button
					type="submit"
					class="w-full rounded bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
				>
					Yes, Log Out
				</button>
			</form>

			<div class="mt-4">
				<a href="/" class="text-sm text-slate-500 hover:text-slate-700">
					Cancel
				</a>
			</div>
		</div>
	</div>
</main>
