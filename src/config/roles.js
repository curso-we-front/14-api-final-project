const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  AUTHOR: "author",
  READER: "reader",
}

const CONTENT_MANAGERS = [ROLES.ADMIN, ROLES.EDITOR]

module.exports = { ROLES, CONTENT_MANAGERS }
