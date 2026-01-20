<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	interface AdminSectionChirho {
		titleChirho: string;
		descriptionChirho: string;
		hrefChirho: string;
		iconChirho: string;
	}

	const sectionsChirho: AdminSectionChirho[] = [
		{
			titleChirho: 'Users',
			descriptionChirho: 'Manage user accounts and permissions',
			hrefChirho: '/admin-chirho/users-chirho',
			iconChirho: '👥'
		},
		{
			titleChirho: 'Languages',
			descriptionChirho: 'Manage translation languages and settings',
			hrefChirho: '/admin-chirho/languages-chirho',
			iconChirho: '🌐'
		},
		{
			titleChirho: 'Jobs',
			descriptionChirho: 'View background job status and history',
			hrefChirho: '/admin-chirho/jobs-chirho',
			iconChirho: '⚙️'
		}
	];
</script>

<svelte:head>
	<title>Admin | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold text-slate-800">Administration</h1>
		<p class="mt-2 text-slate-600">Manage platform settings and users</p>

		<div class="mt-8 grid gap-6 md:grid-cols-3">
			{#each sectionsChirho as sectionChirho}
				<a href={sectionChirho.hrefChirho} class="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
					<span class="text-3xl">{sectionChirho.iconChirho}</span>
					<h2 class="mt-4 text-lg font-semibold text-slate-800">{sectionChirho.titleChirho}</h2>
					<p class="mt-1 text-sm text-slate-600">{sectionChirho.descriptionChirho}</p>
				</a>
			{/each}
		</div>

		<div class="mt-8 text-center">
			<a href="/" class="text-blue-600 hover:underline text-sm">← Back to Home</a>
		</div>
	</div>
</div>
