const client = require('../db');
const { CHARACTER_QUERY_ERRORS } = require('./character.queries');

const KEYSTONE_QUERY_ERRORS = {
    KEYSTONE_NOT_CREATED: 'KEYSTONE_NOT_CREATED',
    KEYSTONE_EXISTS: 'KEYSTONE_EXISTS',
    KEYSTONE_DOES_NOT_EXIST: 'KEYSTONE_DOES_NOT_EXIST',
}

const _checkForExistingCharacter = async character => {
    try {
        const characterResult = await client.query(
            `SELECT * FROM character WHERE name = $1`, 
            [character]
        );

        return characterResult.rows.length > 0 ? characterResult.rows[0] : null;
    } catch (e) {
        throw e;
    }
}

const _checkForExistingKeystone = async characterId => {
    try {
        const keystoneResult = await client.query(
            `SELECT * FROM keystone WHERE character_id = $1`, 
            [characterId]
        );

        return keystoneResult.rows.length > 0;
    } catch (e) {
        throw e;
    }
}

const listKeystonesQuery = async () => {
    try {
        const keystonesResult = await client.query(
            `SELECT * FROM keystone`
        )

        return keystonesResult.rows;
    } catch (e) {
        throw e;
    }
}

const addKeystoneQuery = async ({ character, difficulty, dungeon }) => {
    try {
        const characterResult = await _checkForExistingCharacter(character);

        if (!characterResult) {
            return {
                success: false,
                reason: CHARACTER_QUERY_ERRORS.CHARACTER_NOT_TRACKED,
            }
        }

        const characterId = characterResult.id;
        console.log(characterId);

        const keystoneExists = await _checkForExistingKeystone(characterId);

        if (keystoneExists) {
            return {
                success: false,
                reason: KEYSTONE_QUERY_ERRORS.KEYSTONE_EXISTS,
            }
        }

        // All checks passed -- add key
        const res = await client.query(
            `INSERT INTO keystone(character_id, difficulty, dungeon) VALUES($1, $2, $3) RETURNING *`, 
            [characterId, difficulty, dungeon]
        )

        if (res.rows.length === 0) {
            return {
                success: false,
                reason: KEYSTONE_QUERY_ERRORS.KEYSTONE_NOT_CREATED
            }
        }

        return {
            success: true,
            reason: null,
        };
    } catch (e) {
        console.log(e.stack);
        throw e;
    }
}

const updateKeystoneQuery = async ({ character, difficulty, dungeon }) => {
    try {
        const characterResult = await _checkForExistingCharacter(character);

        if (!characterResult) {
            return {
                success: false,
                reason: CHARACTER_QUERY_ERRORS.CHARACTER_NOT_TRACKED,
            }
        }

        const characterId = characterResult.id;

        const keystoneExists = await _checkForExistingKeystone(characterId);

        if (!keystoneExists) {
            return {
                success: false,
                reason: KEYSTONE_QUERY_ERRORS.KEYSTONE_DOES_NOT_EXIST,
            }
        }

        // Update existing key for user
        const res = await client.query(
            `UPDATE keystone SET (difficulty, dungeon) = ($1, $2) WHERE character_id = $3 RETURNING *`,
            [difficulty, dungeon, characterId]
        );

        if (res.rows.length === 0) {
            return {
                success: false,
                reason: KEYSTONE_QUERY_ERRORS.KEYSTONE_NOT_CREATED,
            }
        }

        return {
            success: true,
            reason: null
        }
    } catch (e) {
        console.log(e.stack);
        throw e;
    }
}

const deleteKeystoneQuery = async ({ character }) => {
    try {
        const characterResult = await _checkForExistingCharacter(character);

        if (!characterResult) {
            return {
                success: false,
                reason: CHARACTER_QUERY_ERRORS.CHARACTER_NOT_TRACKED,
            }
        }

        const characterId = characterResult.id;

        const keystoneExists = await _checkForExistingKeystone(characterId);

        if (keystoneExists) {
            return {
                success: false,
                reason: KEYSTONE_QUERY_ERRORS.KEYSTONE_EXISTS,
            }
        }

        // Delete existing key for user
        await client.query(
            `DELETE FROM keystone WHERE character_id = $1`,
            [characterId]
        );

        return {
            success: true,
            reason: null,
        }
    } catch (e) {
        console.log(e.stack);
        throw e;
    }
}

module.exports = {
    KEYSTONE_QUERY_ERRORS,
    listKeystonesQuery,
    addKeystoneQuery,
    updateKeystoneQuery,
    deleteKeystoneQuery
}