<script lang="ts">

    import { onMount } from 'svelte';
    import { Chart, Card, A, Dropdown, DropdownItem, Button, Modal } from 'flowbite-svelte';
    import { UsersGroupOutline, ArrowUpOutline, ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
    import { options } from '$lib/scripts/modalStore';

    export let open: boolean;

    $: $options//, console.log($options);

    interface Player2 {
        id: number;
        firstName: string;
        lastName: string;
        position: {
            displayName: string;
        };
        height: string;
        weight: string;
        headshot: {
            href: string;
        };
    }

    interface Player {
        id: string;
        fullName: string;
        contracts: {
            salary: number;
            season: {
            year: number;
            };
        }[];
    }

    interface Stats {
        id: number;
        date: string;
        opponent: string;
        points: number;
        rebounds: number;
        assists: number;
        steals: number;
        blocks: number;
        turnovers: number;
        minutes: number;
    }

    let showModal = false;
    let playerData: any = null;
    let teams: any[] = [];
    let players: any[] = [];
    let query = '';
    let filteredTeams: any[] = [];
    let selectedTeam: any = null; // Track the selected team
    let loading = false;
    let panelPlayers: { [key: number]: { details: any[], stats: { [key: string]: any } } } = {
        0: { details: [], stats: {} },
        1: { details: [], stats: {} },
        2: { details: [], stats: {} },
        3: { details: [], stats: {} }
    }

    async function fetchTeams(): Promise<any[]> {
        const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';

        try {
            const response = await fetch(url);

            const data = await response.json(); // Updated: Use async/await for better readability
            playerData = data; // Ensure playerData is assigned properly
            return data.sports[0].leagues[0].teams;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    export async function getPlayersByTeam2(teamId: number): Promise<Player[]> {
        const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/' + teamId + '/roster';
        
        try {
            const response = await fetch(url);

            const data = await response.json();
            
            console.log(data.athletes);
            
            return data.athletes;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }


export async function getPlayersByTeam(teamId: number): Promise<Player[]> {
    const url = `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Sort players by total salary
        const players = data.athletes as Player[];
        
        // Function to calculate the total salary of a player
        function getTotalSalary(player: Player, currentYear: number): number {
            return player.contracts.reduce((total, contract) => {
                if (contract.season.year >= currentYear) {
                    return total + contract.salary;
                }
                return total;
            }, 0);
        }

        // Assuming the current year is 2025
        const currentYear = 2025;

        // Sort players based on their total salary
        players.sort((a, b) => {
            const totalSalaryA = getTotalSalary(a, currentYear);
            const totalSalaryB = getTotalSalary(b, currentYear);
            return totalSalaryB - totalSalaryA; // descending order
        });

        return players;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

    export async function getStatsByPlayer(playerId: number): Promise<Stats[]> {
        const url = 'https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/' + playerId + '/gamelog';

        try {
            let mostRecentEvent: any = null;
            let points: any = null;

            const response = await fetch(url);

            const data = await response.json();

            Object.values(data.events).forEach((event: any) => {
                if (!mostRecentEvent || new Date(event.gameDate) > new Date(mostRecentEvent.gameDate)) {
                    mostRecentEvent = event;
                }
            });
            Object.values(data.seasonTypes[0].categories).forEach((month: any) => {
                Object.values(month.events).forEach((event: any) => {
                    if (event.eventId == mostRecentEvent.id) {
                        points = event.stats[13]; //13 is points
                    }
                });
            });
            return points;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    export async function getLast5GamesPointsByPlayer(playerId: number): Promise<[string, number][]> {
        const url = 'https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/' + playerId + '/gamelog';
        const response = await fetch(url);
        const data = await response.json();

        // Collect all game events
        const events = Object.values(data.events).map((event: any) => ({
            date: new Date(event.gameDate),
            eventId: event.id
        }));

        // Sort events by date (most recent first)
        events.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Get the last 5 games
        const last5Games = events.slice(0, 5);

        // Get points for the last 5 games
        const points: [string, number][] = last5Games.map<[string, number]>((game) => {
            const month = Object.values(data.seasonTypes[0].categories).find((month: any) =>
                Object.values(month.events).some((event: any) => event.eventId === game.eventId)
            );
            const event = month && typeof month === 'object' && 'events' in month && Array.isArray(month.events) ? month.events.find((event: any) => event.eventId === game.eventId) : null;
            const formattedDate = `${game.date.getMonth() + 1}/${game.date.getDate()}`;

            return [formattedDate, event?.stats[13] || 0]; // 13 is points, default to 0 if undefined
        }).filter((pts) => pts[1] !== undefined);
        
        $options[getNextAvailablePanelIndex()].series[0].data = points.map(([date, value]) => ({ x: date, y: value }));

        return points;
    }

    export async function getStatsByPlayerSeason(playerId: number, season: number): Promise<Stats[]> {
        //https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/3032977/gamelog?season=2020
        const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes/' + playerId + '/gamelog?season=' + season;
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!apiKey) {
            throw new Error('API key not found');
        }
        try {
            const response = await fetch(url);

            const data = await response.json();

            return data.athletes;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }
  
    // Fetch all teams on mount
    onMount(async () => {
        teams = await fetchTeams();
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
        players = await getPlayersByTeam(team.id.toString());
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
        //console.error($options);
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
            const stats = await getLast5GamesPointsByPlayer(player.id);
            
            $options[nextPanelIndex].series[0].data = stats.map(([date, value]) => ({ x: date, y: value }));
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
        $options[0].yaxis[0].max = newMax;
        $options[1].yaxis[0].max = newMax;
        $options[2].yaxis[0].max = newMax;
        $options[3].yaxis[0].max = newMax;
    }
</script>

    <button on:click={openModal} class="toggle-button">Open Modal</button>
    
    <Modal title="Player Panels" bind:open={showModal} outsideclose class="compareModal" size="xl">
        <div class="minimizable-window">
            {#each Object.keys(panelPlayers) as index}
            <div class="panel" id={index}>
                <h3>Panel {parseInt(index) + 1}</h3>
                <Button on:click={() => removePlayer(Number(index))}>Remove Player</Button>
                <ul>
                {#each panelPlayers[Number(index)].details as player}
                    <li>
                        <h2>{player.firstName} {player.lastName}</h2>
                        <img src={player.headshot.href} alt={player.headshot.alt} />
                        <br />
                        <p>Position: {player.position.displayName || 'N/A'}</p>
                        <p>Height: {player.height ? `${Math.floor(player.height / 12)}' ${player.height % 12}"` : 'N/A'}</p>
                        <p>Weight: {player.weight || 'N/A'}</p>
                        <p>Points: {panelPlayers[Number(index)].stats[0]}</p>
                    </li>
                    <Card>
                        <Chart options={$options[Number(index)]} />
                    </Card>
                {/each}
                </ul>
            </div>
            {/each}
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
                        <img src={player.headshot.href} />
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
      text-align: center;
    }
  
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
  
    .team-card, .player-card {
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 42px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        text-align: center;
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .team-card:hover, .player-card:hover {
        transform: scale(1.2);
    }

    .team-card img {
        max-width: 100%;
        height: auto;
        display: block;
    }

    .player-card h2 , .team-card h2{
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    
    .player-card p {
        font-size: 1rem;
        margin: 5px 0;
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

    .toggle-button {
        margin: 1rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border: none;
        background-color: #28a745;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    .toggle-button:hover {
        background-color: #218838;
    }

    .minimizable-window {
        display: flex;
        flex-direction: row; /* Arrange panels horizontally */
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        margin: 1rem 0;
        background-color: #f9f9f9;
        overflow-x: auto; /* Enable horizontal scrolling if needed */
    }

    .panel {
        flex: 1 1 45%; /* Set the width of each panel to 25% */
        margin-right: 1rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #fff;
        box-sizing: border-box;
        margin: 0.5rem
    }

    .panel h3 {
        margin-top: 0;
    }

    .panel button {
        margin: 0 0.5rem;
        padding: 0.3rem 0.6rem;
        font-size: 0.9rem;
        border: none;
        background-color: #007BFF;
        color: #fff;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    .panel button:hover {
        background-color: #0056b3;
    }

    .compareModal {
        width: 80%; /* Adjust the width as needed */
        max-width: 900px; /* Set a maximum width */
        height: auto; /* Adjust the height as needed */
        max-height: 90%; /* Set a maximum height */
    }
  </style>
  