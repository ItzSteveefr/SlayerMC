const { ActivityType } = require('discord.js');

module.exports = async function (client) {
    client.once('ready', async () => {
        try {
            // Define the statuses here
            const statuses = [
                {
                    content: 'Minecraft On SlayerMC',
                    type: 'PLAYING',
                    status: 'online',
                },
                {
                    content: 'Developed By ItzStevee',
                    type: 'LISTENING',
                    status: 'idle',
                }
            ];

            let currentIndex = 0;

            const updateStatus = async () => {
                const status = statuses[currentIndex];
                await client.user.setPresence({
                    activities: [
                        {
                            name: status.content,
                            type: ActivityType[status.type],
                        },
                    ],
                    status: status.status,
                });

                currentIndex = (currentIndex + 1) % statuses.length; // Cycle through the list
            };

            // Set the initial status
            await updateStatus();
            client.logs.success('Initial Activity Loaded!');

            // Update status at regular intervals (e.g., every 10 seconds)
            setInterval(updateStatus, 10000);
        } catch (error) {
            client.logs.error('Error loading activity:', error);
        }
    });
}
