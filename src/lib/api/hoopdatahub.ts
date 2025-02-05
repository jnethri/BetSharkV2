const url = 'https://api.hoopdatahub.com/players?playerId=201939';

async function fetchPlayerData(apiKey: string): Promise<void> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': apiKey, // Replace YOUR_API_KEY with your actual key
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response received:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage
fetchPlayerData('5a954b6b-56b6-4a15-93b9-d83e13c7a728'); // Replace YOUR_API_KEY with your actual key
