const users = [];

// New User join
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Getting current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves the chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get all the users in a room
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};