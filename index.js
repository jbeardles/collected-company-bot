require('dotenv').config();

const db = require('./src/db');
const discord = require('./src/discord');

const { addCharacter, deleteCharacter } = require('./src/actions/character.actions');
const { CHARACTER_COMMANDS, KEYSTONE_COMMANDS } = require('./src/commands');
const { listKeystones, addKeystone, updateKeystone, deleteKeystone } = require('./src/actions/keystone.actions');

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

    /* ==========================
    ** Characters
    ** ========================*/

    // Adding a user
    if (CHARACTER_COMMANDS.ADD_CHARACTER.test(content)) {
        await addCharacter(content, channel);
        return;
    }

    // Deleting a user
    if (CHARACTER_COMMANDS.DELETE_CHARACTER.test(content)) {
        await deleteCharacter(content, channel);
        return;
    }

    /* ==========================
    ** Keys
    ** ========================*/
    if (KEYSTONE_COMMANDS.LIST.test(content)) {
        await listKeystones(channel);
        return;
    }

    if (KEYSTONE_COMMANDS.ADD_KEYSTONE.test(content)) {
        await addKeystone(content, channel);
        return;
    }

    if (KEYSTONE_COMMANDS.UPDATE_KEYSTONE.test(content)) {
        await updateKeystone(content, channel);
        return;
    }

    channel.send('Unrecognized command. Type `!cc commands` for a list of commands.');
})

discord.login(process.env.DISCORD_CLIENT_TOKEN);