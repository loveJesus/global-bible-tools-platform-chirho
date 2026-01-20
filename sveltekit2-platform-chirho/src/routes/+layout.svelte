<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import '../app.css';
	import type { LayoutData as LayoutDataChirho } from './$types';

	let { children, data }: { children: any; data: LayoutDataChirho } = $props();

	let userMenuOpenChirho = $state(false);

	function getInitialsChirho(nameChirho: string | null | undefined, emailChirho: string): string {
		if (nameChirho) {
			return nameChirho
				.split(' ')
				.map((partChirho) => partChirho[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}
		return emailChirho[0].toUpperCase();
	}
</script>

<svelte:head>
	<title>Global Bible Tools</title>
	<meta name="description" content="Collaborative Bible translation platform" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="bg-white border-b border-slate-200">
		<div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-6">
				<a href="/" class="flex items-center gap-2">
					<img
						src="https://assets.globalbibletools.com/landing/logo.png"
						alt="Global Bible Tools"
						class="h-8 w-8"
					/>
					<span class="text-xl font-bold text-slate-900">Global Bible Tools</span>
				</a>
				<nav class="hidden sm:flex gap-4">
					<a href="/read-chirho" class="text-slate-600 hover:text-slate-900">Read</a>
					<a href="/translate-chirho" class="text-slate-600 hover:text-slate-900">Translate</a>
					<a href="/downloads-chirho" class="text-slate-600 hover:text-slate-900">Downloads</a>
				</nav>
			</div>
			<div class="flex items-center gap-4">
				{#if data.userChirho}
					<div class="relative">
						<button
							type="button"
							onclick={() => (userMenuOpenChirho = !userMenuOpenChirho)}
							class="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100 transition-colors"
							aria-haspopup="menu"
							aria-expanded={userMenuOpenChirho}
						>
							<div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
								{getInitialsChirho(data.userChirho.nameChirho, data.userChirho.emailChirho)}
							</div>
							<span class="hidden sm:block text-sm text-slate-700">{data.userChirho.nameChirho ?? data.userChirho.emailChirho}</span>
							<svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{#if userMenuOpenChirho}
							<div class="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5" role="menu">
								<div class="px-4 py-2 border-b border-slate-100">
									<p class="text-sm font-medium text-slate-900">{data.userChirho.nameChirho ?? 'User'}</p>
									<p class="text-xs text-slate-500 truncate">{data.userChirho.emailChirho}</p>
								</div>

								<a href="/profile-chirho" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors" role="menuitem">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									Profile
								</a>

								{#if data.userChirho.isAdminChirho}
									<a href="/admin-chirho" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors" role="menuitem">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
										Admin
									</a>
								{/if}

								<div class="border-t border-slate-100 mt-1">
									<a href="/logout-chirho" class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" role="menuitem">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
										Logout
									</a>
								</div>
							</div>

							<button
								type="button"
								class="fixed inset-0 z-40 cursor-default"
								onclick={() => (userMenuOpenChirho = false)}
								onkeydown={(eChirho) => eChirho.key === 'Escape' && (userMenuOpenChirho = false)}
								aria-label="Close menu"
								tabindex="-1"
							></button>
						{/if}
					</div>
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
