<script lang="ts">
    import { onMount } from 'svelte';

    let playerData: any = null; // Updated: Initialize playerData
    
    async function fetchPlayerData(): Promise<void> {
        const url = 'https://api.hoopdatahub.com/players?firstName=steph';
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!apiKey) {
            throw new Error('API key not found');
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': apiKey,
                },
            });

            const data = await response.json(); // Updated: Use async/await for better readability
            playerData = data; // Ensure playerData is assigned properly
            console.log('data:', data); // Log the data for debugging
        } catch (error) {
            console.error('Error:', error);
        }
    }

    onMount(() => {
        fetchPlayerData();
    });
</script>

<main>
    <h1>Home</h1>
    <p>Welcome to the Home page</p>
    {#if playerData} <!-- Conditionally render to prevent undefined errors -->
        <p>Player Name: {playerData.firstName} {playerData.lastName}</p>
    {/if}
</main>

<style>
    main {
        padding: 1rem;
    }
</style>
