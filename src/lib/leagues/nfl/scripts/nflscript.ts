export async function getStatsByPlayer(playerId: string): Promise<any[]> {
    const url = `https://example.com/api/football/stats?playerId=${playerId}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.stats; // Customize based on API response structure
    } catch (error) {
      console.error('Error fetching football stats:', error);
      return [];
    }
  }
  
  export const footballStatMapping = {
    touchdowns: (stat: any) => ({ x: stat.date, y: stat.touchdowns }),
    passingYards: (stat: any) => ({ x: stat.date, y: stat.passingYards }),
    rushingYards: (stat: any) => ({ x: stat.date, y: stat.rushingYards }),
  };