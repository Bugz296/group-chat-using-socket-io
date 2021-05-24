/**
 * Require Modules
 */
const express = require('express');
const session = require('express-session');
const http = require('http');
const app = express();
const server = app.listen(8000);
const io = require('socket.io')(server);


app.use(session({
    secret: 'thisIsASecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null }
}));
app.use(express.static(__dirname));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');


/**
 * Routes
 */
app.get('/', function(req, res){
    let session_id = req.sessionID;
    res.render('index', {session_id});
});

/* Just for this assigmment, I will store conversation to an array */
let conversation = [];
/* Socket Event Listener */
io.on('connection', function(socket){
    /* Pass array that has conversation before user joined, that will be loaded on the view file */
    if(conversation){
        socket.emit('load_conversation', conversation);
    }
    /* After a user enters his/her name */
    socket.on('got_a_new_user', function(data){
        let userdata = {
            name: data.name,
            session_id: data.session_id
        };
        socket.user_name = data.name;
        io.emit('new_user', {userdata});
    });
    /* When a user sends a message */
    socket.on('add_message', function(data){
        socket.broadcast.emit('added_message', {data});
        socket.emit('sent_message', {data});
        conversation.push(data);
    });

    socket.on('disconnect', function(){
        socket.broadcast.emit('disconnected_user', {name: socket.user_name});
    });
});