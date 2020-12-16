const client = require("../db");

const CHARACTER_QUERY_ERRORS = {
  CHARACTER_NOT_TRACKED: "CHARACTER_NOT_TRACKED",
  CHARACTER_EXISTS: "CHARACTER_EXISTS",
  CHARACTER_NOT_CREATED: "CHARACTER_NOT_CREATED",
};

const getCharacterQuery = async characterId => {
  try {
    const characterResult = await client.query(
      `SELECT * FROM character WHERE id = $1`,
      [characterId]
    );

    return characterResult.rows[0];
  } catch (e) {
    throw e;
  }
};

const addCharacterQuery = async (character) => {
  try {
    const dupes = await client.query(
      `SELECT * FROM character WHERE name = $1`,
      [character]
    );

    if (dupes.rows.length > 0) {
      return {
        success: false,
        reason: CHARACTER_QUERY_ERRORS.CHARACTER_EXISTS,
      };
    }

    const res = await client.query(
      `INSERT INTO character(name) VALUES($1) RETURNING *`,
      [character]
    );

    if (res.rows.length === 0) {
      return {
        success: false,
        reason: CHARACTER_QUERY_ERRORS.CHARACTER_NOT_CREATED,
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
};

const deleteCharacterQuery = async (username) => {
  try {
    await client.query(`DELETE FROM character WHERE name = $1`, [username]);

    return {
      success: true,
      reason: null,
    };
  } catch (e) {
    console.log(e.stack);
    throw e;
  }
};

module.exports = {
  CHARACTER_QUERY_ERRORS,
  getCharacterQuery,
  addCharacterQuery,
  deleteCharacterQuery,
};
