<script>
    import { getContext } from 'svelte';
    const { data } = getContext("data");
    export const iname = data.name; 
</script>