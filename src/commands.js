const CHARACTER_COMMANDS = {
    ADD_CHARACTER: new RegExp(/^!cc character add \w+$/),
    DELETE_CHARACTER: new RegExp(/^!cc character remove \w+$/),
}

const KEYSTONE_COMMANDS = {
    ADD_KEYSTONE: new RegExp(/^!cc keystone add \w+\s[a-zA-Z\s]*\d+$/),
    UPDATE_KEYSTONE: new RegExp(/^!cc keystone update \w+\s[a-zA-Z\s]*\d+$/),
    DELETE_KEYSTONE: new RegExp(/^!cc keystone delete \w+$/),
    LIST: new RegExp(/^!cc keystone list$/),
}

module.exports = {
    CHARACTER_COMMANDS,
    KEYSTONE_COMMANDS,
}