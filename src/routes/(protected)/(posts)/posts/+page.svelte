<script lang="ts">
    import PostList from "$lib/components/PostList.svelte";
    let { data } = $props();
</script>

<h1>Posts</h1>
<PostList {data} />