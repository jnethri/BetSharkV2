export function getNextAvailablePanelIndex(panelPlayers: { [key: number]: { details: any[], stats: { [key: string]: any } } }): number {
    for (let i = 0; i < 4; i++) {
        if (!panelPlayers[i].details.length) {
            return i;
        }
    }
    return -1;
}

export function isPlayerAlreadyAdded(panelPlayers: { [key: number]: { details: any[], stats: { [key: string]: any } } }, player: any): boolean {
    for (let i = 0; i < 4; i++) {
        if (panelPlayers[i].details.some(p => p.id === player.id)) {
            return true;
        }
    }
    return false;
}
