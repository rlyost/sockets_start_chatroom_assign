// Import express and path modules.
var express = require( "express");
var session = require('express-session');
var path = require( "path");
// Create the express app.
var app = express();
// Define the static folder.
app.use(express.static(path.join(__dirname, "./static")));
app.use(session({
    secret: "rangersleadtheway",
    resave: true,
    saveUninitialized: true    
}));  // string for encryption
// Setup ejs templating and define the views folder.
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// Root route to render the index.ejs view.
app.get('/', function(req, res) {
    if(!session['users']){
        session['users']={};
    };
 res.render("index");
})
var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here
    socket.on( "add_new_user", function (data){
        var new_id = socket.id;
        session.users[new_id] = data.name;
        console.log("Users:", session.users);
        var room_string = '';
        var user_string = '';
        user_string = "<div class='d-inline-block border border-dark fader' id='" + new_id + "' style='width: 200px; height: 200px; background-color: white'><p class='d-inline-block text-center' style='width: 200px; height: 50px; background-color: grey'>" + session.users[new_id] + "</p></div>";
        console.log(user_string);
        for(var key in session.users) {
            console.log(key, session.users[key]);
            room_string += "<div class='d-inline-block border border-dark fader' id='" + key + "' style='width: 200px; height: 200px; background-color: white'><p class='d-inline-block text-center' style='width: 200px; height: 50px; background-color: grey'>" + session.users[key] + "</p></div>";
        };
        socket.emit( 'update_room', room_string);
        socket.broadcast.emit('update_room', user_string);
    })
    socket.on( "disconnect", function (){
        delete session.users[socket.id];
        socket.broadcast.emit('left_room', socket.id);
    });
})
  
