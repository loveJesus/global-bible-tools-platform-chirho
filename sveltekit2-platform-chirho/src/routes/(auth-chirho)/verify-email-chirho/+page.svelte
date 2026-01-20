<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	let verifyingChirho = $state(true);
	let successChirho = $state(false);
	let errorChirho = $state<string | null>(null);
</script>

<svelte:head>
	<title>Verify Email | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
	<div class="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8">
		<h1 class="text-2xl font-bold text-slate-800 text-center">Verify Email</h1>
		<p class="mt-2 text-slate-600 text-center">Confirming your email address</p>

		<!-- TODO: Implement email verification -->
		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
			This feature is coming soon.
		</div>

		<div class="mt-6 text-center">
			<a href="/login-chirho" class="text-blue-600 hover:underline text-sm">Back to Login</a>
		</div>
	</div>
</div>
