
let dataConnection;
let rooomId;
let peer;
let localStream;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

document.getElementById('create-room').addEventListener('click',function(){
    /*
    var roomId = document.getElementById('room-id').value;
    if(roomId == "" || roomId == " "){
        alert('please enter room no');
        return;
    }
    */
   createCanvas();
   roomId = randomAlpha(3)+"-"+randomAlpha(3);
    //create peer with id
    peer = new Peer(roomId);

    peer.on('open',function(id){
        console.log("peer id: "+id);
        alert(roomId);
        if(getUserMedia ){
            getUserMedia(
                {
                    video: {
                        width:  1080,
                        height: 720,
                        },
                    audio: true,
                },
                function(stream){
                    localStream = stream
                    var video = document.querySelector('video');
                    video.srcObject = localStream;
                    video.onloadedmetadata = function(e){
                        video.play();
                    }
                },  
                function(err){
                    console.log(err);
                }
            );
        }else{
            console.log("getuserMedia not supported ");
        }

    });
    peer.on('call',function(data){
        data.answer(localStream);
        data.on('stream',function(remoteStream){
         var video =  document.querySelector("#remote-video");
         video.srcObject = remoteStream;
         video.play();
      });
     });

    peer.on('connection',function(data){
        console.log("connected with sender");
        dataConnection = data;

        data.on('data',function(data){
            console.log("server: "+data);
            
        });

    });
    peer.on('disconnected', function() {
        console.log("disconnected ");
        peer.disconnect();
    });


});




//join
document.getElementById('join-room').addEventListener('click',function(){
    var roomId = document.getElementById('room-id').value;
    if(roomId == "" || roomId == " "){
        alert('please enter room no');
        return;
    }
    createCanvas();
    peer = new Peer();
    /*
    peer.on('open',function(id){

       console.log("connected with: "+id);
       dataConnection = peer.connect(roomId);
       dataConnection.send("hello");


       dataConnection.on('data',function(data){
        console.log("user: "+data);
    });
    });
    */
    peer.on('open',function(id){

        dataConnection = peer.connect(roomId);
        dataConnection.on('data',function(data){
        console.log("user: "+data);
        });



        if(getUserMedia){
            getUserMedia(
                {
                    video: {
                        width:  1080,
                        height: 720,
                        },
                    audio: true,
                },
                function(stream){
                    localStream = stream;
                    var video = document.querySelector('video');
                    video.srcObject = stream;
                    video.onloadedmetadata = function(e){
                        video.play();
                    }

                    var call = peer.call(roomId,localStream);
                    call.on('stream',function(stream){
                        var video =  document.querySelector("#remote-video");
                        video.srcObject = stream;
                        video.play();
                    });
                },
                function(err){
                    console.log(err);
                }
            );
        }else{
            console.log("getuserMedia not supported ");
        }
    });

    peer.on('disconnected', function() {
        console.log("disconnected ");
        peer.des
    });
    
});

//######################
function sendMsg(){
    dataConnection.send("hello");
}
//##########################

document.getElementById('disconnect-call').addEventListener('click',function(){
    peer.disconnect();
    peer.destroy();
});

function randomAlpha(length) {
    var result           = [];
    var characters       = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

function createCanvas(){
    document.getElementById('home').style.display="none";
    document.getElementById('meeting').style.display="block";
}


