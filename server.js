const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./controllers/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./controllers/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const bot = "ChatBot";

// A new connection
io.on("connection", (socket) => {

    socket.on("joinRoom", ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome messageto the new user
        socket.emit('message', formatMessage(bot, "Welcome to the room"));

        //Broadcast when a user joins
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined the chat`));

    });


    //Chat messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });


    // when a user leaves
    socket.on("disconnect", () => {

        const user = userLeave(socket.id);

        if (user) {
          io.to(user.room).emit(
            "message",
            formatMessage(bot, `${user.username} has left the chat`)
          );
    
          // Send users and room info
          io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
          });
        }

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));