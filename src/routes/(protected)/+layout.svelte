<script lang="ts">
    let { children } = $props();
</script>

<div>
    <h1>Protected Layout</h1>
    {@render children()}
</div>