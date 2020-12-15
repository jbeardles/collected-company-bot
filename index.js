require('dotenv').config();

const discord = require('discord.js');
const client = new discord.Client();
const db = require('./src/db');

db.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected to pg instance');
    }
});

client.on('ready', () => {
    console.log('I am ready!');
})

client.on('message', msg => {
    const { content, channel } = msg;
    if (content.slice(0, 2) !== '!cc' || channel !== 'bot-text') {
        return;
    }

    if (msg.content === "!cc vizbot" || msg.content === "!cc kazbot") {
        msg.channel.send("Hellllllll Yeahhhhhh");
    }
})

client.login(process.env.DISCORD_CLIENT_TOKEN);