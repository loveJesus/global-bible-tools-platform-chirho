<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';
	import { tChirho } from '$lib/i18n-chirho';

	let { form: formChirho }: { form: ActionDataChirho } = $props();
</script>

<svelte:head>
	<title>{$tChirho('common.authChirho.registerChirho')} - {$tChirho('common.appNameChirho')}</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-lg shadow-md p-8">
			<h1 class="text-2xl font-bold text-slate-900 text-center mb-6">
				{$tChirho('common.authChirho.createAccountChirho')}
			</h1>

			{#if formChirho?.errorChirho}
				<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
					{formChirho.errorChirho}
				</div>
			{/if}

			<form method="POST" use:enhanceChirho class="space-y-4">
				<div>
					<label for="name" class="block text-sm font-medium text-slate-700 mb-1">
						Name
					</label>
					<input
						type="text"
						id="name"
						name="nameChirho"
						value={formChirho?.nameChirho ?? ''}
						required
						autocomplete="name"
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="Your name"
					/>
				</div>

				<div>
					<label for="email" class="block text-sm font-medium text-slate-700 mb-1">
						{$tChirho('common.authChirho.emailChirho')}
					</label>
					<input
						type="email"
						id="email"
						name="emailChirho"
						value={formChirho?.emailChirho ?? ''}
						required
						autocomplete="email"
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder={$tChirho('common.authChirho.emailPlaceholderChirho')}
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-slate-700 mb-1">
						{$tChirho('common.authChirho.passwordChirho')}
					</label>
					<input
						type="password"
						id="password"
						name="passwordChirho"
						required
						minlength="8"
						autocomplete="new-password"
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder={$tChirho('common.authChirho.passwordPlaceholderChirho')}
					/>
				</div>

				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1">
						{$tChirho('common.authChirho.confirmPasswordChirho')}
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPasswordChirho"
						required
						minlength="8"
						autocomplete="new-password"
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder={$tChirho('common.authChirho.passwordPlaceholderChirho')}
					/>
				</div>

				<button
					type="submit"
					class="w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					{$tChirho('common.authChirho.registerChirho')}
				</button>
			</form>

			<div class="mt-6 text-center text-sm text-slate-600">
				{$tChirho('common.authChirho.haveAccountChirho')}
				<a href="/login-chirho" class="text-blue-600 hover:underline">
					{$tChirho('common.authChirho.signInChirho')}
				</a>
			</div>
		</div>

		<div class="mt-4 text-center">
			<a href="/" class="text-sm text-slate-500 hover:text-slate-700">
				{$tChirho('common.authChirho.backToHomeChirho')}
			</a>
		</div>
	</div>
</main>
