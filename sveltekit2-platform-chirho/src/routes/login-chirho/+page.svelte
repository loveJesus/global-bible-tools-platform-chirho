<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { form: formChirho }: { form: ActionDataChirho } = $props();
</script>

<svelte:head>
	<title>Login - Global Bible Tools</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-lg shadow-md p-8">
			<h1 class="text-2xl font-bold text-slate-900 text-center mb-6">Login</h1>

			{#if formChirho?.errorChirho}
				<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
					{formChirho.errorChirho}
				</div>
			{/if}

			<form method="POST" use:enhanceChirho class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-slate-700 mb-1">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="emailChirho"
						value={formChirho?.emailChirho ?? ''}
						required
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-slate-700 mb-1">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="passwordChirho"
						required
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="Enter your password"
					/>
				</div>

				<button
					type="submit"
					class="w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Login
				</button>
			</form>

			<div class="mt-6 text-center text-sm text-slate-600">
				<a href="/forgot-password-chirho" class="text-blue-600 hover:underline">
					Forgot your password?
				</a>
			</div>

			<div class="mt-4 text-center text-sm text-slate-600">
				Don't have an account?
				<a href="/register-chirho" class="text-blue-600 hover:underline">
					Register
				</a>
			</div>
		</div>

		<div class="mt-4 text-center">
			<a href="/" class="text-sm text-slate-500 hover:text-slate-700">
				Back to home
			</a>
		</div>
	</div>
</main>
