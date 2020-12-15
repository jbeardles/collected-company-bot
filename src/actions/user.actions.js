const { addUserQuery, deleteUserQuery, USER_QUERY_ERRORS } = require('../queries/user.queries');

const addUser = async (content, channel) => {
    const username = content.split(' ')[3]

    try {
        const { success, reason } = await addUserQuery(username);

        if (!success) {
            if (reason === USER_QUERY_ERRORS.USER_EXISTS) {
                channel.send(`Collected Company Bot is already tracking ${username}.`);
            } else {
                channel.send(`There was an error adding user ${username}. Please try again or contact Star for a fix!`);
            }
        } else {
            channel.send(`Collected Company Bot is now tracking ${username}!`)
        }
    } catch (e) {
        channel.send(`Internal error adding user ${username}. Please try again or contact Star for a fix!`);
    }
}

const deleteUser = async (content, channel) => {
    const username = content.split(' ')[3];

    try {
        const { success, reason } = await deleteUserQuery(username);

        if (!success) {
            channel.send(`There was an error deleting user ${username}. Please try again or contact Star for a fix!`);
        } else {
            channel.send(`Collected Company Bot has stopped tracking ${username}.`);
        }
    } catch (e) {

    }
}

module.exports = { addUser, deleteUser };