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
