const { KEYSTONE_QUERY_ERRORS, listKeystonesQuery, addKeystoneQuery, updateKeystoneQuery, deleteKeystoneQuery } = require('../queries/keystone.queries');
const { USER_QUERY_ERRORS, CHARACTER_QUERY_ERRORS } = require('../queries/character.queries');
const { getCharacter } = require('./character.actions');

const listKeystones = async channel => {
    try {
        const keystones = await listKeystonesQuery();
        const keystoneList = [];
        for (let i = 0; i < keystones.length; i++) {
            const keystone = keystones[i];
            const character = await getCharacter(keystone.character_id);
            keystoneList.push(`**${character.name}**: +${keystone.difficulty} ${keystone.dungeon}.`);
        }
        channel.send(keystoneList.join('\n'));
    } catch (e) {
        console.log(e.stack);
        channel.send(`Internal error getting keystone list. Please try again or contact Star for a fix!`);
    }
}

const addKeystone = async (content, channel) => {
    // !cc keystone add Merseyside Necrotic Wake 14
    const splitContent = content.split(' ');
    const character = splitContent[3]
    const difficulty = splitContent[splitContent.length -1];
    const dungeon = splitContent.slice(4, splitContent.length -1).join(' ');

    try {
        const { success, reason } = await addKeystoneQuery({ character, difficulty, dungeon });

        if (!success) {
            if (reason === CHARACTER_QUERY_ERRORS.CHARACTER_NOT_TRACKED) {
                channel.send(`Character ${character} is not being tracked. Type \`!cc character add ${character}\` to track a new character.`);
            } else if (reason === KEYSTONE_QUERY_ERRORS.KEYSTONE_EXISTS) {
                channel.send(`A key already exists for ${character}. Did you mean to use the update command instead?`);
            } else {
                channel.send(`There was an error adding this key for ${character}. Please try again or contact Star for a fix!`);
            }
        } else {
            channel.send(`Collected Company Bot is now tracking a new key for ${character}: *+${difficulty} ${dungeon}*`);
        }
    } catch (e) {
        console.log(e.stack);
        channel.send(`Internal error adding new key for ${character}. Please try again or contact Star for a fix!`);
    }

}

const updateKeystone = async (content, channel) => {
    // !cc keystone update Merseyside Plaguefall 15
    const splitContent = content.split(' ');
    const character = splitContent[3]
    const difficulty = splitContent[splitContent.length -1];
    const dungeon = splitContent.slice(4, splitContent.length -1).join(' ');

    try {
        const { success, reason } = await updateKeystoneQuery({ character, difficulty, dungeon });

        if (!success) {
            if (reason === CHARACTER_QUERY_ERRORS.CHARACTER_NOT_TRACKED) {
                channel.send(`Character ${character} is not being tracked. Type \`!cc character add ${character}\` to track a new character.`);
            } else if (reason === KEYSTONE_QUERY_ERRORS.KEYSTONE_DOES_NOT_EXIST) {
                channel.send(`No keystone found for ${character}. Please add a key before trying to update.`)
            } else {
                channel.send(`There was an error updating this key for ${character}. Please try again or contact Star for a fix!`);
            }
        } else {
            channel.send(`Updated key for ${character}. New key is: **+${difficulty} ${dungeon}**`)
        }
    } catch (e) {
        console.log(e.stack);
        channel.send(`Internal error adding new key for ${character}. Please try again or contact Star for a fix!`);
    }

}

const deleteKeystone = async (content, channel) => {
    // !cc keys delete Merseyside

}

module.exports = {
    listKeystones,
    addKeystone,
    updateKeystone,
    deleteKeystone,
}