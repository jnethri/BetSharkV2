import type { Stats } from '$lib/scripts/player';

export async function getStatsByPlayer(playerId: number): Promise<Stats[]> {
    const url = `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerId}/gamelog`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.events;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getStatsByPlayerSeason(playerId: number, season: number): Promise<Stats[]> {
    const url = `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes/${playerId}/gamelog?season=${season}`;
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
