<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho, ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { data: dataChirho, form: formChirho }: { data: PageDataChirho; form: ActionDataChirho } =
		$props();

	let creatingChirho = $state(false);
	let restoringIdChirho = $state<string | null>(null);
	let showConfirmRestoreChirho = $state<string | null>(null);
	let noteChirho = $state('');

	// Pagination
	const totalPagesChirho = $derived(Math.ceil(dataChirho.totalChirho / dataChirho.pageSizeChirho));

	function formatDateChirho(dateChirho: Date | string): string {
		const dChirho = typeof dateChirho === 'string' ? new Date(dateChirho) : dateChirho;
		return dChirho.toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'short'
		});
	}
</script>

<svelte:head>
	<title>Snapshots - {dataChirho.languageChirho.nameChirho} | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-slate-800">Snapshots</h1>
				<p class="text-slate-600">
					Backup and restore translation data for {dataChirho.languageChirho.nameChirho}
				</p>
			</div>
			<a
				href="/admin-chirho/languages-chirho"
				class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
			>
				← Back to Languages
			</a>
		</div>

		<!-- Messages -->
		{#if formChirho?.successChirho}
			<div
				class="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm"
			>
				{formChirho.messageChirho}
			</div>
		{/if}
		{#if formChirho?.errorChirho}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
				{formChirho.errorChirho}
			</div>
		{/if}

		<!-- Create Snapshot Section -->
		{#if dataChirho.isAdminChirho}
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
				<h2 class="text-lg font-semibold text-slate-800 mb-4">Create New Snapshot</h2>
				<form
					method="POST"
					action="?/createSnapshotChirho"
					use:enhanceChirho={() => {
						creatingChirho = true;
						return async ({ update: updateChirho }) => {
							await updateChirho();
							creatingChirho = false;
							noteChirho = '';
						};
					}}
					class="flex flex-col sm:flex-row gap-4"
				>
					<input
						type="text"
						name="note"
						bind:value={noteChirho}
						placeholder="Optional note (e.g., 'Before major changes')"
						class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						disabled={creatingChirho}
						class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{#if creatingChirho}
							<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Creating...
						{:else}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
								/>
							</svg>
							Create Snapshot
						{/if}
					</button>
				</form>
				<p class="mt-3 text-sm text-slate-500">
					A snapshot saves all phrases, glosses, and translation history for this language. Use it
					before making major changes.
				</p>
			</div>
		{/if}

		<!-- Snapshots List -->
		<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
			<div class="px-6 py-4 border-b border-slate-200">
				<h2 class="text-lg font-semibold text-slate-800">
					Snapshot History ({dataChirho.totalChirho} total)
				</h2>
			</div>

			{#if dataChirho.snapshotsChirho.length > 0}
				<table class="w-full">
					<thead class="bg-slate-50 border-b border-slate-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>Timestamp</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>Note</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>Status</th
							>
							{#if dataChirho.isAdminChirho}
								<th
									class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
									>Actions</th
								>
							{/if}
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each dataChirho.snapshotsChirho as snapshotChirho}
							<tr class="hover:bg-slate-50">
								<td class="px-6 py-4 text-sm text-slate-900">
									{formatDateChirho(snapshotChirho.timestampChirho)}
								</td>
								<td class="px-6 py-4 text-sm text-slate-600">
									{snapshotChirho.noteChirho || '—'}
								</td>
								<td class="px-6 py-4">
									<span
										class="px-2 py-1 text-xs rounded {snapshotChirho.statusChirho === 'completed'
											? 'bg-emerald-100 text-emerald-700'
											: snapshotChirho.statusChirho === 'pending'
												? 'bg-amber-100 text-amber-700'
												: 'bg-red-100 text-red-700'}"
									>
										{snapshotChirho.statusChirho}
									</span>
								</td>
								{#if dataChirho.isAdminChirho}
									<td class="px-6 py-4 text-right">
										{#if snapshotChirho.statusChirho === 'completed'}
											{#if showConfirmRestoreChirho === snapshotChirho.idChirho}
												<form
													method="POST"
													action="?/restoreSnapshotChirho"
													use:enhanceChirho={() => {
														restoringIdChirho = snapshotChirho.idChirho;
														return async ({ update: updateChirho }) => {
															await updateChirho();
															restoringIdChirho = null;
															showConfirmRestoreChirho = null;
														};
													}}
													class="inline-flex items-center gap-2"
												>
													<input type="hidden" name="snapshotId" value={snapshotChirho.idChirho} />
													<button
														type="submit"
														disabled={restoringIdChirho === snapshotChirho.idChirho}
														class="text-red-600 hover:text-red-800 text-sm font-medium"
													>
														{#if restoringIdChirho === snapshotChirho.idChirho}
															Restoring...
														{:else}
															Confirm
														{/if}
													</button>
													<button
														type="button"
														onclick={() => (showConfirmRestoreChirho = null)}
														class="text-slate-500 hover:text-slate-700 text-sm"
													>
														Cancel
													</button>
												</form>
											{:else}
												<button
													type="button"
													onclick={() => (showConfirmRestoreChirho = snapshotChirho.idChirho)}
													class="text-amber-600 hover:text-amber-800 text-sm flex items-center gap-1"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
														/>
													</svg>
													Restore
												</button>
											{/if}
										{/if}
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<div class="px-6 py-12 text-center text-slate-500">
					No snapshots yet. Create one to back up your translation data.
				</div>
			{/if}
		</div>

		<!-- Pagination -->
		{#if totalPagesChirho > 1}
			<div class="mt-6 flex justify-center gap-2">
				{#if dataChirho.pageChirho > 1}
					<a
						href="?page={dataChirho.pageChirho - 1}"
						class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm"
					>
						Previous
					</a>
				{/if}

				<span class="px-4 py-2 text-sm text-slate-600">
					Page {dataChirho.pageChirho} of {totalPagesChirho}
				</span>

				{#if dataChirho.pageChirho < totalPagesChirho}
					<a
						href="?page={dataChirho.pageChirho + 1}"
						class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm"
					>
						Next
					</a>
				{/if}
			</div>
		{/if}

		<!-- Info Box -->
		<div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
			<h3 class="text-sm font-semibold text-blue-800 mb-2">About Snapshots</h3>
			<ul class="text-sm text-blue-700 space-y-1 list-disc list-inside">
				<li>Snapshots save all translation data: phrases, glosses, and history</li>
				<li>Restoring a snapshot will replace all current translation data</li>
				<li>This action cannot be undone - create a snapshot before restoring</li>
				<li>Only administrators can create and restore snapshots</li>
			</ul>
		</div>
	</div>
</div>
