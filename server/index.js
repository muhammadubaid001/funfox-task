const express = require("express");
const cors = require('cors')

const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const data = require('./data.json')

const io = new Server({ cors: true });
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(express.json())

app.get('/tasks', (req, res) => {
  res.send(data)
})

io.on("connection", (socket) => {
  socket.on("new-task", (data) => {
    const { group, email } = data;

    socket.emit('new-task-added', { group: +group })

    socket.to(group).emit('task-added', data)
  });

});

app.listen(5000, () => {
  console.log("listening on *:5000");
});

io.listen(5001);
