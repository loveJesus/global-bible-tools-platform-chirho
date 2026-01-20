<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import { tChirho } from '$lib/i18n-chirho';

	let { data: dataChirho }: { data: PageDataChirho } = $props();
</script>

<svelte:head>
	<title>{$tChirho('common.authChirho.verifyEmailChirho')} - {$tChirho('common.appNameChirho')}</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
	<div class="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8">
		{#if dataChirho.modeChirho === 'sent'}
			<!-- Email sent confirmation -->
			<div class="text-center">
				<div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
					<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-slate-800">{$tChirho('common.authChirho.verifyEmailChirho')}</h1>
				<p class="mt-4 text-slate-600">
					{$tChirho('common.authChirho.checkEmailChirho')}
				</p>
				<p class="mt-2 text-sm text-slate-500">
					Check your spam folder if you don't see the email.
				</p>
			</div>
		{:else if dataChirho.modeChirho === 'error'}
			<!-- Error -->
			<div class="text-center">
				<div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
					<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-slate-800">{$tChirho('common.messagesChirho.errorChirho')}</h1>
				<p class="mt-4 text-slate-600">
					{dataChirho.errorChirho}
				</p>
			</div>
		{:else}
			<!-- Instructions / No token -->
			<div class="text-center">
				<div class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
					<svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-slate-800">{$tChirho('common.authChirho.verifyEmailChirho')}</h1>
				<p class="mt-4 text-slate-600">
					Please check your email and click the verification link to activate your account.
				</p>
			</div>
		{/if}

		<div class="mt-6 text-center space-y-2">
			<a href="/login-chirho" class="block text-blue-600 hover:underline text-sm">
				{$tChirho('common.authChirho.loginChirho')}
			</a>
			<a href="/" class="block text-slate-500 hover:text-slate-700 text-sm">
				{$tChirho('common.authChirho.backToHomeChirho')}
			</a>
		</div>
	</div>
</div>
