var app = require('express')();
var cors = require('cors')
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    origins: ['*']
});

var players = [];

app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('new connection');

    socket.on('new player', ( player ) => {
        player.serverIndex = socket.id;
        players.push(player);

        socket.emit("player index", socket.id);

        io.emit('players', players);
        console.log( `Player connected: ${players.length}` );
    });

    socket.on('update player', ( player ) => {
        playerIndex = players.map( (p) => p.serverIndex ).indexOf(player.serverIndex);
        players[playerIndex] = player;
        io.emit('players', players);

        console.log( `Player connected: ${players.length}` );
    });

    socket.on('disconnect', () => {
        playerIndex = players.map( (p) => p.serverIndex ).indexOf(player.serverIndex);
        players.splice(playerIndex, 1);
        io.emit('players', players);
        console.log( `Player connected: ${players.length}` );
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});