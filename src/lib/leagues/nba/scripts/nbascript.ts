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
  
  export const basketballStatMapping = {
    points: (stat: number) => ({ x: stat.date, y: stat.points }),
    assists: (stat: any) => ({ x: stat.date, y: stat.assists }),
    rebounds: (stat: any) => ({ x: stat.date, y: stat.rebounds }),
    steals: (stat: any) => ({ x: stat.date, y: stat.steals }),
    blocks: (stat: any) => ({ x: stat.date, y: stat.blocks }),
    turnovers: (stat: any) => ({ x: stat.date, y: stat.turnovers }),
  };

export async function fetchNBATeams(): Promise<any[]> {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.sports[0].leagues[0].teams;
    } catch (error) {
      console.error('Error fetching basketball teams:', error);
      return [];
    }
}

export async function getNBAPlayersByTeam(teamId: number): Promise<Player[]> {
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`;
    
    console.log(url);

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

        //console.log(players);

        return players;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getStatsByNBAPlayer(playerId: number): Promise<Stats[]> {
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

export async function getLast5GamesStatsByNBAPlayer(playerId: number): Promise<[string, number, number, number, number, number, number, number, number][]> {
    const url = 'https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/' + playerId + '/gamelog';
    const response = await fetch(url);
    const data = await response.json();

    /*
    0: "MIN"
    1: "FG"
    2: "FG%"
    3: "3PT"
    4: "3P%"
    5:  "FT"
    6: "FT%"
    7: "REB"
    8: "AST"
    9: "BLK"
    10: "STL"
    11: "PF"
    12: "TO"
    13: "PTS"
    */

    // Collect all game events
    const events = Object.values(data.events).map((event: any) => ({
        date: new Date(event.gameDate),
            eventId: event.id
        }));

    // Sort events by date (most recent first)
    events.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Get the last 5 games
    const last5Games = events.slice(0, 5);
    //console.log(data);
    
    // Get points for the last 5 games
    let stats: { date: string; points: number; assists: number; rebounds: number; fgs: number; threes: number; steals: number; blocks: number; turnovers: number }[] = last5Games.map((game) => {
        const month = Object.values(data.seasonTypes[0].categories).find((month: any) =>
            Object.values(month.events).some((event: any) => event.eventId === game.eventId)
        );

        const event = month && typeof month === 'object' && 'events' in month && Array.isArray(month.events)
            ? month.events.find((event: any) => event.eventId === game.eventId)
            : null;

        const formattedDate = `${game.date.getMonth() + 1}/${game.date.getDate()}`;

        // Extract stats, using default value of 0 if undefined
        const points = event?.stats[13] || 0; // points
        const assists = event?.stats[8] || 0; // assists
        const rebounds = event?.stats[7] || 0; // rebounds
        const fgs = event?.stats[1] || 0; // FG
        const threes = event?.stats[3] || 0; // 3PT
        const steals = event?.stats[10] || 0; // steals
        const blocks = event?.stats[9] || 0; // blocks
        const turnovers = event?.stats[12] || 0; // turnovers

        return {
            date: formattedDate,
            points,
            assists,
            rebounds,
            fgs,
            threes,
            steals,
            blocks,
            turnovers
        };
    }).filter((gameStats) => gameStats.points !== undefined || gameStats.assists !== undefined || gameStats.rebounds !== undefined || gameStats.fgs !== undefined || gameStats.threes !== undefined || gameStats.steals !== undefined || gameStats.blocks !== undefined || gameStats.turnovers !== undefined);

    stats = stats.reverse();

    return stats.map(({ date, points, assists, rebounds, fgs, threes, steals, blocks, turnovers }) => [date, points, assists, rebounds, fgs, threes, steals, blocks, turnovers]);
}

export async function getStatsByNBAPlayerSeason(playerId: number, season: number): Promise<Stats[]> {
    //https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/3032977/gamelog?season=2020
    const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes/' + playerId + '/gamelog?season=' + season;
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

//

export async function getPlayersByTeam2(teamId: number): Promise<Player[]> {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/' + teamId + '/roster';
    
    try {
        const response = await fetch(url);

        const data = await response.json();
        
        //console.log(data.athletes);
        
        return data.athletes;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}