export interface Player {
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

export interface Stats {
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


export async function getPlayersByTeam(teamId: number): Promise<Player[]> {
    const url = `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.athletes;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}
