<script lang="ts">
    import { onMount } from 'svelte';
    import { getAllTeams, getPlayersByTeam } from '$lib/api/balldontlie';
  
    let teams: any[] = [];
    let players: any[] = [];
    let query = '';
    let filteredTeams: any[] = [];
    let selectedTeam: any = null; // Track the selected team
    let loading = false;
  
    // Fetch all teams on mount
    onMount(async () => {
      teams = await getAllTeams();
      filteredTeams = teams;
    });
  
    // Filter teams dynamically
    function filterTeams() {
      filteredTeams = teams.filter((team) =>
        team.full_name.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Handle team selection
    async function selectTeam(team: any) {
        console.error(team.id.toString());   
        loading = true;
        selectedTeam = team;
        players = await getPlayersByTeam(team.id);
        loading = false;
    }
  
    // Handle going back to team view
    function backToTeams() {
      selectedTeam = null;
      players = [];
    }
  </script>
  
  <!-- Search Bar -->
  <div class="search-container" hidden={selectedTeam !== null}>
    <input
      type="text"
      bind:value={query}
      placeholder="Search for NBA teams..."
      on:input={filterTeams}
      class="search-bar"
    />
  </div>
  
  <!-- Teams Grid -->
  {#if !selectedTeam}
    <div class="grid">
      {#each filteredTeams as team}
        <div class="team-card" on:click={() => selectTeam(team)}>
          <h2>{team.full_name}</h2>
          <p>{team.abbreviation}</p>
          <p>City: {team.city}</p>
          <p>Conference: {team.conference}</p>
          <p>Division: {team.division}</p>
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- Players Grid -->
  {#if selectedTeam}
    <button on:click={backToTeams} class="back-button">← Back to Teams</button>
  
    {#if loading}
      <p>Loading players...</p>
    {:else if players.length > 0}
      <div class="grid">
        {#each players as player}
          <div class="player-card">
            <h2>{player.first_name} {player.last_name}</h2>
            <p>Position: {player.position || 'N/A'}</p>
            <p>Height: {player.height_feet ? `${player.height_feet}'${player.height_inches}"` : 'N/A'}</p>
            <p>Weight: {player.weight_pounds ? `${player.weight_pounds} lbs` : 'N/A'}</p>
          </div>
        {/each}
      </div>
    {:else}
      <p>No players found for this team.</p>
    {/if}
  {/if}
  
  <style>
    .search-container {
      margin-bottom: 1rem;
      text-align: center;
    }
  
    .search-bar {
      padding: 0.5rem;
      width: 50%;
      max-width: 400px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
  
    .team-card, .player-card {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }
  
    .team-card:hover, .player-card:hover {
      transform: scale(1.03);
    }
  
    .back-button {
      margin: 1rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border: none;
      background-color: #007BFF;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }
  
    .back-button:hover {
      background-color: #0056b3;
    }
  </style>
  