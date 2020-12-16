const { addCharacterQuery, deleteCharacterQuery, CHARACTER_QUERY_ERRORS, getCharacterQuery } = require('../queries/character.queries');

const getCharacter = async characterId => {
    try {
        const character = await getCharacterQuery(characterId);
        return character;
    } catch (e) {
        throw e;
    }
}

const addCharacter = async (content, channel) => {
    const character = content.split(' ')[3]

    try {
        const { success, reason } = await addCharacterQuery(character);

        if (!success) {
            if (reason === CHARACTER_QUERY_ERRORS.CHARACTER_EXISTS) {
                channel.send(`Collected Company Bot is already tracking ${character}.`);
            } else {
                channel.send(`There was an error adding character ${character}. Please try again or contact Star for a fix!`);
            }
        } else {
            channel.send(`Collected Company Bot is now tracking ${character}!`)
        }
    } catch (e) {
        channel.send(`Internal error adding character ${character}. Please try again or contact Star for a fix!`);
    }
}

const deleteCharacter = async (content, channel) => {
    const character = content.split(' ')[3];

    try {
        const { success, reason } = await deleteCharacterQuery(character);

        if (!success) {
            channel.send(`There was an error deleting character ${character}. Please try again or contact Star for a fix!`);
        } else {
            channel.send(`Collected Company Bot has stopped tracking ${character}.`);
        }
    } catch (e) {
        channel.send(`Internal error deleting character ${character}. Please try again or contact Star for a fix!`);
    }
}

module.exports = { getCharacter, addCharacter, deleteCharacter };