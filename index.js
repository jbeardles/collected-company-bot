require('dotenv').config();

const db = require('./src/db');
const discord = require('./src/discord');

const { addUser, deleteUser } = require('./src/actions/user.actions');
const { USER_COMMANDS } = require('./src/commands');

db.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected to pg instance');
    }
});

discord.on('ready', () => {
    console.log('I am ready!');
})

discord.on('message', async msg => {
    const { content, channel } = msg;

    if (content.slice(0, 3) !== '!cc' || channel.name !== 'bot-testing') {
        return;
    }

    // Adding a user
    if (USER_COMMANDS.ADD_USER.test(content)) {
        await addUser(content, channel);
        return;
    }

    // Deleting a user
    if (USER_COMMANDS.DELETE_USER.test(content)) {
        await deleteUser(content, channel);
        return;
    }

    channel.send('Unrecognized command. Type `!cc commands` for a list of commands.');
})

discord.login(process.env.DISCORD_CLIENT_TOKEN);