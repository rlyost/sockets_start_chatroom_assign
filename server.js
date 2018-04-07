// Import express and path modules.
var express = require( "express");
var session = require('express-session');
var path = require( "path");
// Create the express app.
var app = express();
// Define the static folder.
app.use(express.static(path.join(__dirname, "./static")));
// Setup ejs templating and define the views folder.
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// Root route to render the index.ejs view.
app.get('/', function(req, res) {
 res.render("index");
})
var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    var count = 0;
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here
    socket.on( "blue_button_clicked", function (data){
        console.log( 'Someone clicked a button!  Reason: '  + data.reason);
        count++;
        var count_string = "The button has been pushed " + count + " time(s)";
        socket.emit( 'update_count', count_string);
    })
    socket.on( "red_button_clicked", function (data){
        console.log( 'Someone clicked a button!  Reason: '  + data.reason);
        count = 0;
        var count_string = "The button has been pushed " + count + " time(s)";
        socket.emit( 'update_count', count_string);
    })
})
  
