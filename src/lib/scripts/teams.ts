export interface Team {
    id: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    logos: {
        href: string;
    }[];
}

export async function fetchTeams(): Promise<Team[]> {
    const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
    try {
        const response = await fetch(url);
        const data = await response.json();

        return data.sports[0].leagues[0].teams;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}
