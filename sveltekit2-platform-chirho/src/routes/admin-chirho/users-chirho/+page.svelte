<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho, ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { data: dataChirho, form: formChirho }: { data: PageDataChirho; form: ActionDataChirho } =
		$props();

	let searchQueryChirho = $state('');

	// Filter users by search query
	const filteredUsersChirho = $derived(
		dataChirho.usersChirho.filter(
			(userChirho) =>
				(userChirho.nameChirho?.toLowerCase() ?? '').includes(searchQueryChirho.toLowerCase()) ||
				userChirho.emailChirho.toLowerCase().includes(searchQueryChirho.toLowerCase())
		)
	);

	function getStatusBadgeClassChirho(statusChirho: string): string {
		if (statusChirho === 'active') return 'bg-emerald-100 text-emerald-700';
		return 'bg-red-100 text-red-700';
	}

	function getEmailStatusBadgeClassChirho(statusChirho: string): string {
		if (statusChirho === 'VERIFIED') return 'bg-blue-100 text-blue-700';
		if (statusChirho === 'BOUNCED' || statusChirho === 'COMPLAINED')
			return 'bg-red-100 text-red-700';
		return 'bg-amber-100 text-amber-700';
	}
</script>

<svelte:head>
	<title>User Management | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-slate-800">User Management</h1>
				<p class="mt-2 text-slate-600">
					Manage user accounts and permissions ({dataChirho.usersChirho.length} users)
				</p>
			</div>
			<a href="/admin-chirho" class="text-blue-600 hover:underline text-sm">← Back to Admin</a>
		</div>

		<!-- Success/Error Messages -->
		{#if formChirho?.successChirho}
			<div
				class="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm"
			>
				{formChirho.messageChirho}
			</div>
		{/if}
		{#if formChirho?.errorChirho}
			<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
				{formChirho.errorChirho}
			</div>
		{/if}

		<!-- Search -->
		<div class="mt-6">
			<div class="relative max-w-md">
				<input
					type="text"
					placeholder="Search users by name or email..."
					bind:value={searchQueryChirho}
					class="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<svg
					class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>

		<!-- Users Table -->
		<div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
			<table class="w-full">
				<thead class="bg-slate-50 border-b border-slate-200">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>User</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>Email Status</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>Languages</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>Role</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>Status</th
						>
						<th
							class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100">
					{#each filteredUsersChirho as userChirho}
						{@const isCurrentUserChirho = userChirho.idChirho === dataChirho.currentUserIdChirho}
						<tr class="hover:bg-slate-50 {isCurrentUserChirho ? 'bg-blue-50/50' : ''}">
							<td class="px-6 py-4">
								<div>
									<div class="font-medium text-slate-900 flex items-center gap-2">
										{userChirho.nameChirho ?? 'No name'}
										{#if isCurrentUserChirho}
											<span class="text-xs text-blue-600">(you)</span>
										{/if}
									</div>
									<div class="text-sm text-slate-500">{userChirho.emailChirho}</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span
									class="px-2 py-0.5 text-xs rounded {getEmailStatusBadgeClassChirho(
										userChirho.emailStatusChirho
									)}"
								>
									{userChirho.emailStatusChirho}
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="text-slate-600">{userChirho.languageCountChirho}</span>
							</td>
							<td class="px-6 py-4">
								{#if userChirho.isAdminChirho}
									<span class="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-700">
										Admin
									</span>
								{:else}
									<span class="text-slate-400 text-sm">User</span>
								{/if}
							</td>
							<td class="px-6 py-4">
								<span
									class="px-2 py-0.5 text-xs rounded {getStatusBadgeClassChirho(
										userChirho.statusChirho
									)}"
								>
									{userChirho.statusChirho}
								</span>
							</td>
							<td class="px-6 py-4 text-right">
								{#if !isCurrentUserChirho}
									<div class="flex justify-end gap-2">
										<!-- Toggle Admin -->
										<form method="POST" action="?/toggleAdminChirho" use:enhanceChirho>
											<input type="hidden" name="userId" value={userChirho.idChirho} />
											<input
												type="hidden"
												name="makeAdmin"
												value={userChirho.isAdminChirho ? 'false' : 'true'}
											/>
											<button
												type="submit"
												class="text-sm {userChirho.isAdminChirho
													? 'text-purple-600 hover:text-purple-800'
													: 'text-slate-600 hover:text-slate-800'}"
											>
												{userChirho.isAdminChirho ? 'Remove Admin' : 'Make Admin'}
											</button>
										</form>

										<!-- Toggle Status -->
										<form method="POST" action="?/toggleStatusChirho" use:enhanceChirho>
											<input type="hidden" name="userId" value={userChirho.idChirho} />
											<input
												type="hidden"
												name="status"
												value={userChirho.statusChirho === 'active' ? 'disabled' : 'active'}
											/>
											<button
												type="submit"
												class="text-sm {userChirho.statusChirho === 'active'
													? 'text-red-600 hover:text-red-800'
													: 'text-emerald-600 hover:text-emerald-800'}"
											>
												{userChirho.statusChirho === 'active' ? 'Disable' : 'Enable'}
											</button>
										</form>
									</div>
								{:else}
									<span class="text-xs text-slate-400">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			{#if filteredUsersChirho.length === 0}
				<div class="px-6 py-12 text-center text-slate-500">
					{#if searchQueryChirho}
						No users match "{searchQueryChirho}"
					{:else}
						No users found
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
