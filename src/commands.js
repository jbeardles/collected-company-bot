const USER_COMMANDS = {
    ADD_USER: new RegExp(/^!cc users add \w+$/),
    DELETE_USER: new RegExp(/^!cc users remove \w+$/),
}

module.exports = {
    USER_COMMANDS,
}