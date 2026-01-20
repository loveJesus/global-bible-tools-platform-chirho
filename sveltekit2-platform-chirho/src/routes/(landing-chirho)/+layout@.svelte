<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import '../../app.css';

	let { children }: { children: any } = $props();
</script>

<!-- Landing pages have their own navigation/footer, no wrapper needed -->
{@render children()}
