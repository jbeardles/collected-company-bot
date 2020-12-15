const client = require('../db');

const USER_QUERY_ERRORS = {
    USER_EXISTS: 'USER_EXISTS',
    USER_NOT_CREATED: 'USER_NOT_CREATED',
}

const addUserQuery = async username => {
    try {
        const dupes = await client.query(`SELECT * FROM users WHERE name = $1`, [username]);
        
        if (dupes.rows.length > 0) {
            return {
                success: false,
                reason: USER_QUERY_ERRORS.USER_EXISTS
            }
        }

        const res = await client.query(`INSERT INTO users(name) VALUES($1) RETURNING *`, [username]);

        if (res.rows.length === 0) {
            return {
                success: false,
                reason: USER_QUERY_ERRORS.USER_NOT_CREATED,
            };
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

const deleteUserQuery = async username => {
    try {
        await client.query(`DELETE FROM users WHERE name = $1`, [username]);

        return {
            success: true,
            reason: null
        };
    } catch (e) {
        console.log(e.stack);
        throw e;
    }
}

module.exports = { USER_QUERY_ERRORS, addUserQuery, deleteUserQuery };