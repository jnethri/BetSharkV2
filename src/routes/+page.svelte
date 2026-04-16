<div class="flex justify-between items-center p-4 bg-gray-800 text-white">
    <!-- Top Left Button -->
    <button class="btn" on:click={() => showModal = true}>Open Modal</button>
  
    <!-- Top Right Dropdown -->
    <div class="relative">
      <button class="btn" on:click={toggleDropdown}>
        League &#9660;
      </button>
      {#if showDropdown}
        <ul class="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">NBA</li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">NFL</li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">MLB</li>
        </ul>
      {/if}
    </div>
  </div>

<Modal title="Player Panels" bind:open={showModal} outsideclose class="compareModal bg-slate-900" size="xl" hideHeader={true}>
    <Button  on:click={toggleView} class="bg-blue-500">
        {isCombinedView ? 'Switch to Separate Charts' : 'Switch to Combined Chart'}
    </Button>
    <Button class="bg-blue-500">Other Metrics<ChevronDownOutline class="w-6 h-6 ms-2 text-white" /></Button>
    <Dropdown {activeUrl}>
        <DropdownItem on:click={() => handleDropdownItemClick('points')}>Points</DropdownItem>
        <DropdownItem on:click={() => handleDropdownItemClick('assists')}>Assists</DropdownItem>
        <DropdownItem on:click={() => handleDropdownItemClick('rebounds')}>Rebounds</DropdownItem>
        <DropdownItem on:click={() => handleDropdownItemClick('fgs')}>Field Goals Made</DropdownItem>
        <DropdownItem on:click={() => handleDropdownItemClick('threes')}>Threes Made</DropdownItem>
        <DropdownItem on:click={() => handleDropdownItemClick('steals')}>Steals</DropdownItem>
        <DropdownItem on:click={() => handleDropdownItemClick('blocks')}>Blocks</DropdownItem>
        <DropdownItem on:click={() => handleDropdownItemClick('turnovers')}>Turnovers</DropdownItem>
    </Dropdown>
    <div class="minimizable-window bg-slate-400">
        {#if !isCombinedView}
            {#each Object.keys(panelPlayers) as index}
                <div class="panel" id={index}>
                    <Button on:click={() => removePlayer(Number(index))} class="bg-blue-500">Remove Player</Button>
                    <ul>
                        {#each panelPlayers[Number(index)].details as player}
                        <li>
                            <h2>{player.firstName} {player.lastName}</h2>
                            <img src={player.headshot?.href || 'default-image.jpg'} alt={player.headshot?.alt || 'Player headshot'} />
                            <br />
                            <p>Position: {player.position.displayName || 'N/A'}</p>
                            <p>Height: {player.height ? `${Math.floor(player.height / 12)}' ${player.height % 12}"` : 'N/A'}</p>
                            <p>Weight: {player.weight || 'N/A'}</p>
                        </li>
                        <Card>
                            <Chart options={$options[Number(index)]} />
                        </Card>
                        {/each}
                    </ul>
                </div>
            {/each}
        {/if}
        {#if isCombinedView}
            <div class="combined-chart">
                <Card horizontal size="xl">
                    <div class="chart-container">
                        <Chart options={$combinedChartOptions} />
                    </div>
                </Card>
            </div>
        {/if}
    </div>
</Modal>

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
    {#each filteredTeams as filteredTeam}
        <div class="team-card" on:click={() => selectTeam(filteredTeam.team)}>
            <h2>{filteredTeam.team.displayName}</h2>
            <p>{filteredTeam.team.abbreviation}</p>
            <img src={filteredTeam.team.logos[0].href} />
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
                <div class="player-card" on:click={() => handlePlayerCardClick(player)}>
                    <h2>{player.firstName} {player.lastName}</h2>
                    <img src={player.headshot?.href || 'default-image.jpg'} alt={player.headshot?.alt || 'Player headshot'} />
                    <br />
                    <p>{player.position.displayName || 'N/A'}</p>
                    <p>Height: {player.height ? `${Math.floor(player.height / 12)}' ${player.height % 12}"` : 'N/A'}</p>
                    <p>Weight: {player.weight + ' lbs'|| 'N/A'}</p>
                </div>
            {/each}
        </div>
    {:else}
        <p>No players found for this team.</p>
    {/if}
{/if}


<script lang="ts">

    import '../styles/page.css';

    //debugger;//addedd
    import { onMount } from 'svelte';
    import { Chart, Card, A, Dropdown, DropdownItem, DropdownDivider, DropdownHeader, Button, Modal } from 'flowbite-svelte';
    import { UsersGroupOutline, ArrowUpOutline, ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
    import { options, combinedChartOptions } from '$lib/scripts/modalStore';
    import { page } from '$app/stores';
    import { fetchNBATeams, getNBAPlayersByTeam, getStatsByNBAPlayer, getStatsByNBAPlayerSeason, getLast5GamesStatsByNBAPlayer } from '$lib/leagues/nba/scripts/nbascript';

    $: activeUrl = $page.url.pathname;

    export let open: boolean;

    $: $options//, console.log($options);


    let showModal = false;
    let teams: any[] = [];
    let players: any[] = [];
    let query = '';
    let filteredTeams: any[] = [];
    let selectedTeam: any = null; // Track the selected team
    let loading = false;
    let isCombinedView = false;
    let panelPlayers: { [key: number]: { details: any[], stats: { [key: string]: any } } } = {
        0: { details: [], stats: {} },
        1: { details: [], stats: {} },
        2: { details: [], stats: {} },
        3: { details: [], stats: {} }
    }



    

    
  
    // Fetch all teams on mount
    onMount(async () => {
        teams = await fetchNBATeams();
        filteredTeams = teams;
    });
  
    // Filter teams dynamically
    function filterTeams() {
        filteredTeams = teams.filter((team) =>
            team.team.displayName.toLowerCase().includes(query.toLowerCase())
        );
    }
  
    // Handle team selection
    async function selectTeam(team: any) {
        loading = true;
        selectedTeam = team;
        players = await getNBAPlayersByTeam(team.id.toString());
        console.log(players);
        loading = false;
    }
  
    // Handle going back to team view
    function backToTeams() {
      selectedTeam = null;
      players = [];
    }

    function removePlayer(panelIndex: number) {
        // Logic to remove a player from the specific panel
        panelPlayers[panelIndex].details = panelPlayers[panelIndex].details.slice(1);
    }

    function openModal() {
        showModal = true;
    }

    function getNextAvailablePanelIndex() {
        // Return the index of the next available panel with less than one player
        for (let i = 0; i < 4; i++) {
            if (!panelPlayers[i].details.length) {
                return i;
            }
        }
        return -1; // All panels are occupied
    }

    function isPlayerAlreadyAdded(player: any) {
        // Check if the player is already present in any panel
        for (let i = 0; i < 4; i++) {
            if (panelPlayers[i].details.some(p => p.id === player.id)) {
                return true;
            }
        }
        return false;
    }

    // Function to handle player card click
    async function handlePlayerCardClick(player: any) {
        if (isPlayerAlreadyAdded(player)) {
            console.warn('Player is already added to a panel.');
            return;
        }
        
        const nextPanelIndex = getNextAvailablePanelIndex();
        if (nextPanelIndex !== -1) {
            const stats = await getLast5GamesStatsByNBAPlayer(player.id);

            $options[nextPanelIndex].series[0].data = stats.map(([date, points, assists, rebounds, steals, blocks, turnovers]) => {
                switch (selectedStat) {
                    case 'points': return { x: date, y: points };
                    case 'assists': return { x: date, y: assists };
                    case 'rebounds': return { x: date, y: rebounds };
                    case 'steals': return { x: date, y: steals };
                    case 'blocks': return { x: date, y: blocks };
                    case 'turnovers': return { x: date, y: turnovers };
                    default: return { x: date, y: points };
                }
            });

            $combinedChartOptions.series[nextPanelIndex].data = $options[nextPanelIndex].series[0].data;

            const maxValue = Math.max(
                ...Object.values($options).flatMap(option => 
                    option.series[0].data.map(data => data.y)
                )
            );

            updateAllChartsYAxes(maxValue);

            panelPlayers[nextPanelIndex] = { details: [player], stats };
        } else {
            console.warn('All panels are occupied. Player cannot be added.');
        }
    }

    function updateAllChartsYAxes(newMax: number) {
        $options[0].yaxis[0].max = Math.ceil(newMax / 5) * 5;
        $options[1].yaxis[0].max = Math.ceil(newMax / 5) * 5;
        $options[2].yaxis[0].max = Math.ceil(newMax / 5) * 5;
        $options[3].yaxis[0].max = Math.ceil(newMax / 5) * 5;
        $combinedChartOptions.yaxis[0].max = Math.ceil(newMax / 5) * 5;
    }

    function toggleView() {
        isCombinedView = !isCombinedView;
    }

    let selectedStat = 'points'; // Default stat

    function handleDropdownItemClick(stat: string) {
        selectedStat = stat;
        updateCharts();
    }

    async function updateCharts() {
        for (let i = 0; i < 4; i++) {
            if (panelPlayers[i].details.length > 0) {
                const player = panelPlayers[i].details[0];
                const stats = await getLast5GamesStatsByNBAPlayer(player.id);
                $options[i].series[0].data = stats.map(([date, points, assists, rebounds, fgs, threes, steals, blocks, turnovers]) => {
                    switch (selectedStat) {
                        case 'points': return { x: date, y: points };
                        case 'assists': return { x: date, y: assists };
                        case 'rebounds': return { x: date, y: rebounds };
                        case 'fgs': return { x: date, y: fgs };
                        case 'threes': return { x: date, y: threes };
                        case 'steals': return { x: date, y: steals };
                        case 'blocks': return { x: date, y: blocks };
                        case 'turnovers': return { x: date, y: turnovers };
                        default: return { x: date, y: points };
                    }
                });
                $combinedChartOptions.series[i].data = $options[i].series[0].data;
            }
        }
    }

  let showDropdown = false;

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }
</script>



