<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	let filterStatusChirho = $state<'all' | 'success' | 'failed' | 'pending'>('all');

	// Filter jobs by status
	const filteredJobsChirho = $derived(
		dataChirho.jobsChirho.filter((jobChirho) => {
			if (filterStatusChirho === 'all') return true;
			if (filterStatusChirho === 'success') return jobChirho.succeededChirho === true;
			if (filterStatusChirho === 'failed') return jobChirho.succeededChirho === false;
			if (filterStatusChirho === 'pending')
				return jobChirho.succeededChirho === null && jobChirho.endDateChirho === null;
			return true;
		})
	);

	function formatDateChirho(dateStringChirho: string): string {
		const dateChirho = new Date(dateStringChirho);
		return dateChirho.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatDurationChirho(secondsChirho: number | null): string {
		if (secondsChirho === null) return '—';
		if (secondsChirho < 60) return `${secondsChirho}s`;
		const minutesChirho = Math.floor(secondsChirho / 60);
		const remainingSecondsChirho = secondsChirho % 60;
		if (minutesChirho < 60) return `${minutesChirho}m ${remainingSecondsChirho}s`;
		const hoursChirho = Math.floor(minutesChirho / 60);
		const remainingMinutesChirho = minutesChirho % 60;
		return `${hoursChirho}h ${remainingMinutesChirho}m`;
	}

	function getStatusBadgeChirho(
		succeededChirho: boolean | null,
		endDateChirho: string | null
	): { classChirho: string; textChirho: string } {
		if (succeededChirho === true) {
			return { classChirho: 'bg-emerald-100 text-emerald-700', textChirho: 'Success' };
		}
		if (succeededChirho === false) {
			return { classChirho: 'bg-red-100 text-red-700', textChirho: 'Failed' };
		}
		if (endDateChirho === null) {
			return { classChirho: 'bg-blue-100 text-blue-700', textChirho: 'Running' };
		}
		return { classChirho: 'bg-slate-100 text-slate-700', textChirho: 'Unknown' };
	}
</script>

<svelte:head>
	<title>Background Jobs | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-slate-800">Background Jobs</h1>
				<p class="mt-2 text-slate-600">View import job status and history</p>
			</div>
			<a href="/admin-chirho" class="text-blue-600 hover:underline text-sm">← Back to Admin</a>
		</div>

		<!-- Stats Cards -->
		<div class="mt-8 grid gap-4 md:grid-cols-4">
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
				<div class="text-2xl font-bold text-slate-900">
					{dataChirho.statsChirho.totalJobsChirho}
				</div>
				<div class="text-sm text-slate-500">Total Jobs</div>
			</div>
			<div class="bg-white rounded-xl shadow-sm border border-emerald-200 p-4">
				<div class="text-2xl font-bold text-emerald-600">
					{dataChirho.statsChirho.successfulJobsChirho}
				</div>
				<div class="text-sm text-slate-500">Successful</div>
			</div>
			<div class="bg-white rounded-xl shadow-sm border border-red-200 p-4">
				<div class="text-2xl font-bold text-red-600">
					{dataChirho.statsChirho.failedJobsChirho}
				</div>
				<div class="text-sm text-slate-500">Failed</div>
			</div>
			<div class="bg-white rounded-xl shadow-sm border border-blue-200 p-4">
				<div class="text-2xl font-bold text-blue-600">
					{dataChirho.statsChirho.pendingJobsChirho}
				</div>
				<div class="text-sm text-slate-500">Running</div>
			</div>
		</div>

		<!-- Filter -->
		<div class="mt-6 flex gap-2">
			<button
				type="button"
				class="px-3 py-1.5 rounded text-sm {filterStatusChirho === 'all'
					? 'bg-slate-800 text-white'
					: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}"
				onclick={() => (filterStatusChirho = 'all')}
			>
				All
			</button>
			<button
				type="button"
				class="px-3 py-1.5 rounded text-sm {filterStatusChirho === 'success'
					? 'bg-emerald-600 text-white'
					: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}"
				onclick={() => (filterStatusChirho = 'success')}
			>
				Success
			</button>
			<button
				type="button"
				class="px-3 py-1.5 rounded text-sm {filterStatusChirho === 'failed'
					? 'bg-red-600 text-white'
					: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}"
				onclick={() => (filterStatusChirho = 'failed')}
			>
				Failed
			</button>
			<button
				type="button"
				class="px-3 py-1.5 rounded text-sm {filterStatusChirho === 'pending'
					? 'bg-blue-600 text-white'
					: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}"
				onclick={() => (filterStatusChirho = 'pending')}
			>
				Running
			</button>
		</div>

		<!-- Jobs Table -->
		<div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
			{#if filteredJobsChirho.length > 0}
				<table class="w-full">
					<thead class="bg-slate-50 border-b border-slate-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>Language</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>Started</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>Duration</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>User</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>Status</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each filteredJobsChirho as jobChirho}
							{@const statusChirho = getStatusBadgeChirho(
								jobChirho.succeededChirho,
								jobChirho.endDateChirho
							)}
							<tr class="hover:bg-slate-50">
								<td class="px-6 py-4">
									<div>
										<div class="font-medium text-slate-900">{jobChirho.languageNameChirho}</div>
										<div class="text-xs text-slate-500 font-mono">
											{jobChirho.languageCodeChirho}
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm text-slate-600">
									{formatDateChirho(jobChirho.startDateChirho)}
								</td>
								<td class="px-6 py-4 text-sm text-slate-600">
									{formatDurationChirho(jobChirho.durationSecondsChirho)}
								</td>
								<td class="px-6 py-4">
									{#if jobChirho.userNameChirho || jobChirho.userEmailChirho}
										<div class="text-sm text-slate-600">
											{jobChirho.userNameChirho ?? jobChirho.userEmailChirho}
										</div>
									{:else}
										<span class="text-sm text-slate-400">System</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									<span class="px-2 py-0.5 text-xs rounded {statusChirho.classChirho}">
										{statusChirho.textChirho}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<div class="px-6 py-12 text-center text-slate-500">
					{#if filterStatusChirho !== 'all'}
						No {filterStatusChirho} jobs found
					{:else}
						No import jobs found
					{/if}
				</div>
			{/if}
		</div>

		<!-- Help Text -->
		<div class="mt-4 text-sm text-slate-500">
			<p>
				Import jobs are created when translators import glosses from external sources. Jobs run
				asynchronously and may take several minutes to complete.
			</p>
		</div>
	</div>
</div>
