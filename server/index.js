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

app.post('/add-task', (req, res) => {
  console.log({ req, res })
  res.send(req.data)
})

io.on("connection", (socket) => {
  socket.on("new-task", (data) => {
    const { group, email } = data;
    socket.emit('task-added', data)

    socket.broadcast.emit('task-added', data)
  });

});

app.listen(5000, () => {
  console.log("listening on *:5000");
});

io.listen(5001);
