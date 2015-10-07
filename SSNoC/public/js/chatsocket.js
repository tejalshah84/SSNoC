var db = require('../../testdb');
module.exports = function(io) {

// Handle socket traffic
io.sockets.on('connection', function (socket) {
    
     // Relay chat data to all clients
    socket.on('new message', function(data) {
    	console.log(data);

    	db.serialize( function(){

            db.run("INSERT INTO chathistory VALUES($next_id, $chatauthor, $chatmessage, $timestamp)", {
                        $chatauthor: data.chatauthor,
                        $timestamp: data.timestamp,
                        $chatmessage: data.chatmessage
                    }, function (err){

                        if(err){
                            console.log('Error occured while storing in chat history');
                        }
                        else{
                          io.sockets.emit('new message', data);
                        }
                    }
            );

        });

 
    });


});

};
