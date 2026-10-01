function onMessage(io,socket){ 
        socket.on('newmsg',(data)=>{    
            io.emit('newmsg', data);   
        });          
}

export {onMessage}