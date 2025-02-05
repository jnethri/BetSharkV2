import { BalldontlieAPI } from "@balldontlie/sdk";

const api = new BalldontlieAPI({ apiKey: "04bfd623-393f-4fa9-8b0b-483fa7f2d80a" });

interface Team {
    id: number;
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
}

interface Player {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    team_id: number;
}

const team = await api.nba.getTeam(1);

export async function searchTeams(query: string): Promise<Team[]> {
    console.error(query.trim());
    //console.error(team);
    return [];
}
export async function searchPlayer(): Promise<Team[]> {
    const response = await api.nba.getPlayer(268);
    //console.error(response);
    return [];
}
searchPlayer();

export async function getAllTeams(): Promise<Team[]> {
    const response = await api.nba.getTeams();
    return response.data;
}

export async function getPlayersByTeam(teamId: number): Promise<Player[]> {
    try {
        const players = await api.nba.getPlayers({ team_ids: [teamId] , per_page: 200});
        console.log('Players from team:', players);
        return players.data;
    } catch (error) {
        console.error('Error fetching players:', error);
        return [];
    }
}