<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho, ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { data: dataChirho, form: formChirho }: { data: PageDataChirho; form: ActionDataChirho } =
		$props();

	let showPasswordFormChirho = $state(false);
	let previewChirho = $state<string | null>(null);
	let processingChirho = $state(false);
	let pictureInputChirho: HTMLInputElement;

	// Image processing - resize to 256x256 and compress to JPEG
	async function processImageChirho(fileChirho: File): Promise<string> {
		return new Promise((resolveChirho, rejectChirho) => {
			const imgChirho = new Image();
			imgChirho.onload = () => {
				const canvasChirho = document.createElement('canvas');
				canvasChirho.width = 256;
				canvasChirho.height = 256;
				const ctxChirho = canvasChirho.getContext('2d')!;

				// Calculate crop to center square
				const sizeChirho = Math.min(imgChirho.width, imgChirho.height);
				const xChirho = (imgChirho.width - sizeChirho) / 2;
				const yChirho = (imgChirho.height - sizeChirho) / 2;

				ctxChirho.drawImage(imgChirho, xChirho, yChirho, sizeChirho, sizeChirho, 0, 0, 256, 256);
				resolveChirho(canvasChirho.toDataURL('image/jpeg', 0.6)); // 60% quality
			};
			imgChirho.onerror = () => rejectChirho(new Error('Failed to load image'));
			imgChirho.src = URL.createObjectURL(fileChirho);
		});
	}

	async function handleFileSelectChirho(eventChirho: Event) {
		const inputChirho = eventChirho.target as HTMLInputElement;
		const fileChirho = inputChirho.files?.[0];
		if (!fileChirho) return;

		// Validate file type
		if (!fileChirho.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		processingChirho = true;
		try {
			previewChirho = await processImageChirho(fileChirho);
		} catch (errChirho) {
			console.error('Error processing image:', errChirho);
			alert('Failed to process image. Please try another file.');
		} finally {
			processingChirho = false;
		}
	}

	function cancelPreviewChirho() {
		previewChirho = null;
		if (pictureInputChirho) {
			pictureInputChirho.value = '';
		}
	}

	function getEmailStatusBadgeClassChirho(statusChirho: string): string {
		if (statusChirho === 'VERIFIED') return 'bg-emerald-100 text-emerald-700';
		if (statusChirho === 'BOUNCED' || statusChirho === 'COMPLAINED')
			return 'bg-red-100 text-red-700';
		return 'bg-amber-100 text-amber-700';
	}

	function getRoleBadgeChirho(roleChirho: string | null): { classChirho: string; textChirho: string } {
		if (roleChirho === 'ADMIN') return { classChirho: 'bg-purple-100 text-purple-700', textChirho: 'Admin' };
		if (roleChirho === 'TRANSLATOR') return { classChirho: 'bg-blue-100 text-blue-700', textChirho: 'Translator' };
		if (roleChirho === 'VIEWER') return { classChirho: 'bg-slate-100 text-slate-600', textChirho: 'Viewer' };
		return { classChirho: 'bg-slate-100 text-slate-600', textChirho: 'Member' };
	}
</script>

<svelte:head>
	<title>Profile | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-2xl mx-auto">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-slate-800">Profile Settings</h1>
				<p class="mt-2 text-slate-600">Manage your account information</p>
			</div>
			{#if dataChirho.isAdminChirho}
				<a href="/admin-chirho" class="text-blue-600 hover:underline text-sm">Admin Dashboard →</a>
			{/if}
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
		{#if formChirho?.passwordSuccessChirho}
			<div
				class="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm"
			>
				{formChirho.messageChirho}
			</div>
		{/if}
		{#if formChirho?.passwordErrorChirho}
			<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
				{formChirho.passwordErrorChirho}
			</div>
		{/if}
		{#if formChirho?.pictureSuccessChirho}
			<div
				class="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm"
			>
				{formChirho.messageChirho}
			</div>
		{/if}
		{#if formChirho?.pictureErrorChirho}
			<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
				{formChirho.pictureErrorChirho}
			</div>
		{/if}

		<!-- Profile Picture -->
		<div class="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
			<h2 class="text-lg font-semibold text-slate-800">Profile Picture</h2>

			<div class="mt-4 flex items-center gap-6">
				<!-- Current/Preview Picture -->
				<div class="w-24 h-24 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
					{#if previewChirho || dataChirho.userChirho.profilePictureChirho}
						<img
							src={previewChirho || dataChirho.userChirho.profilePictureChirho}
							alt="Profile"
							class="w-full h-full object-cover"
						/>
					{:else}
						<svg class="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
						</svg>
					{/if}
				</div>

				<!-- Upload Controls -->
				<div class="flex flex-col gap-2">
					<input
						type="file"
						accept="image/*"
						onchange={handleFileSelectChirho}
						class="hidden"
						id="pictureInputChirho"
						bind:this={pictureInputChirho}
					/>
					<label
						for="pictureInputChirho"
						class="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 text-center text-sm"
					>
						{processingChirho ? 'Processing...' : 'Choose Image'}
					</label>

					{#if previewChirho}
						<form method="POST" action="?/uploadPictureChirho" use:enhanceChirho={() => {
							return async ({ update: updateChirho }) => {
								await updateChirho();
								previewChirho = null;
								if (pictureInputChirho) pictureInputChirho.value = '';
							};
						}}>
							<input type="hidden" name="picture" value={previewChirho} />
							<div class="flex gap-2">
								<button type="submit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
									Save
								</button>
								<button type="button" onclick={cancelPreviewChirho} class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">
									Cancel
								</button>
							</div>
						</form>
					{/if}

					{#if !previewChirho && dataChirho.userChirho.profilePictureChirho}
						<form method="POST" action="?/removePictureChirho" use:enhanceChirho>
							<button type="submit" class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">
								Remove Picture
							</button>
						</form>
					{/if}
				</div>
			</div>
			<p class="mt-3 text-xs text-slate-500">Images will be resized to 256x256 pixels and compressed.</p>
		</div>

		<!-- Account Info -->
		<div class="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
			<h2 class="text-lg font-semibold text-slate-800">Account Information</h2>

			<div class="mt-4 space-y-4">
				<!-- Email (read-only) -->
				<div>
					<span class="block text-sm font-medium text-slate-700">Email</span>
					<div class="mt-1 flex items-center gap-3">
						<span class="text-slate-900">{dataChirho.userChirho.emailChirho}</span>
						<span
							class="px-2 py-0.5 text-xs rounded {getEmailStatusBadgeClassChirho(
								dataChirho.userChirho.emailStatusChirho
							)}"
						>
							{dataChirho.userChirho.emailStatusChirho}
						</span>
					</div>
				</div>

				<!-- Name (editable) -->
				<form method="POST" action="?/updateNameChirho" use:enhanceChirho>
					<label for="name" class="block text-sm font-medium text-slate-700">Name</label>
					<div class="mt-1 flex items-center gap-3">
						<input
							type="text"
							id="name"
							name="name"
							value={dataChirho.userChirho.nameChirho ?? ''}
							placeholder="Enter your name"
							class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="submit"
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Password Section -->
		<div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-slate-800">Password</h2>
				<button
					type="button"
					onclick={() => (showPasswordFormChirho = !showPasswordFormChirho)}
					class="text-blue-600 hover:text-blue-800 text-sm"
				>
					{showPasswordFormChirho ? 'Cancel' : dataChirho.userChirho.hasPasswordChirho ? 'Change Password' : 'Set Password'}
				</button>
			</div>

			{#if !showPasswordFormChirho}
				<p class="mt-2 text-sm text-slate-600">
					{#if dataChirho.userChirho.hasPasswordChirho}
						Password is set. Click "Change Password" to update it.
					{:else}
						No password set. You may have signed in via invitation link. Set a password to enable direct login.
					{/if}
				</p>
			{:else}
				<form method="POST" action="?/updatePasswordChirho" use:enhanceChirho class="mt-4 space-y-4">
					{#if dataChirho.userChirho.hasPasswordChirho}
						<div>
							<label for="currentPassword" class="block text-sm font-medium text-slate-700"
								>Current Password</label
							>
							<input
								type="password"
								id="currentPassword"
								name="currentPassword"
								required
								class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					{/if}

					<div>
						<label for="newPassword" class="block text-sm font-medium text-slate-700"
							>New Password</label
						>
						<input
							type="password"
							id="newPassword"
							name="newPassword"
							required
							minlength="8"
							class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<p class="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
					</div>

					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-slate-700"
							>Confirm Password</label
						>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							required
							minlength="8"
							class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						type="submit"
						class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						{dataChirho.userChirho.hasPasswordChirho ? 'Update Password' : 'Set Password'}
					</button>
				</form>
			{/if}
		</div>

		<!-- Language Memberships -->
		<div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
			<h2 class="text-lg font-semibold text-slate-800">Language Memberships</h2>

			{#if dataChirho.languagesChirho.length > 0}
				<div class="mt-4 divide-y divide-slate-100">
					{#each dataChirho.languagesChirho as langChirho}
						{@const roleBadgeChirho = getRoleBadgeChirho(langChirho.roleChirho)}
						<div class="py-3 flex items-center justify-between">
							<div class="flex items-center gap-3">
								<a
									href="/translate-chirho/{langChirho.languageCodeChirho}"
									class="font-medium text-slate-900 hover:text-blue-600"
								>
									{langChirho.languageNameChirho}
								</a>
								<span class="text-xs text-slate-500 font-mono">{langChirho.languageCodeChirho}</span>
							</div>
							<span class="px-2 py-0.5 text-xs rounded {roleBadgeChirho.classChirho}">
								{roleBadgeChirho.textChirho}
							</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="mt-4 text-sm text-slate-600">
					You are not a member of any translation teams yet.
				</p>
			{/if}

			<div class="mt-4 pt-4 border-t border-slate-100">
				<a href="/translate-chirho" class="text-blue-600 hover:underline text-sm">
					Browse available languages →
				</a>
			</div>
		</div>

		<!-- Quick Links -->
		<div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
			<h2 class="text-lg font-semibold text-slate-800">Quick Links</h2>
			<div class="mt-4 flex flex-wrap gap-4">
				<a href="/read-chirho" class="text-blue-600 hover:underline text-sm">
					Read Translations
				</a>
				<a href="/translate-chirho" class="text-blue-600 hover:underline text-sm">
					Translate
				</a>
				<a href="/downloads-chirho" class="text-blue-600 hover:underline text-sm">
					Downloads
				</a>
				{#if dataChirho.isAdminChirho}
					<a href="/admin-chirho" class="text-blue-600 hover:underline text-sm">
						Admin Dashboard
					</a>
				{/if}
			</div>
		</div>

		<div class="mt-8 flex items-center justify-between">
			<a href="/" class="text-blue-600 hover:underline text-sm">← Back to Home</a>
			<a href="/logout-chirho" class="text-red-600 hover:underline text-sm">Log out</a>
		</div>
	</div>
</div>
