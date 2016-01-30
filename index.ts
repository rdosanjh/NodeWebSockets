/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/socket.io/socket.io.d.ts" />
/// <reference path="typings/node-uuid/node-uuid.d.ts" />
import * as express from "express";
import * as SocketIOStatic from "socket.io";
import * as uuid from "node-uuid"

var MobileDetect = require('mobile-detect');

var app = express();
var http = require('http').Server(app);
var io = SocketIOStatic(http);

app.set('view engine', 'ejs');

var guids = [];

app.use(express.static(__dirname + '/scripts'));


app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html');
    var md = new MobileDetect(req.headers['user-agent']);
    var guid = uuid.v4();
    guids.push(guid);
    res.render('index', { uid: guid, mobile: Boolean(md.mobile()) });
})

app.get('/mobile-detect/', (req, res) => {
    res.sendFile(__dirname + "/node_modules/mobile-detect/mobile-detect.min.js");
})


io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('color', function(color) {
        console.log(color);
        io.emit('color back', color);

    });
});

http.listen(5000, () => {
    console.log('listening on *:5000');
});