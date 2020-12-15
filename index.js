const discord = require('discord.js');
const client = new discord.Client();

client.on('message', msg => {
    if (msg.content === "vizbot" || msg.content === "kazbot") {
        msg.channel.send("Hellllllll Yeahhhhhh");
    }
})

client.login(process.env.DISCORD_CLIENT_TOKEN);