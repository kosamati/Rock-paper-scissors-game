const http = require('http');
const websocket = require('ws');

const server = http.createServer((req, res) => {
    res.end("I am connected");
});

var CLIENT        = [];                                                             //client websocket
var clientValue   = [];                                                             //clinet number
var clientData    = new Array();                                                    //client info
var ID; 

var conuter    = 0;                                                                 //count number of user's
var roomNumber = 0;                                                                 //conut number of room's


const wss = new websocket.Server({ server });                       
wss.on('connection',(ws, req) => {

    // geting data to login
    var url_str = "ws://www.localhost:4000"+req.url; 
    var url = new URL(url_str);   
    var room = url.searchParams.get('room');            
    var nick = url.searchParams.get('nick');    
    romm = parseInt(room, 10)

    var isRoomExisting = false;                                                     //value of room existing 
    ID = conuter;                                                                   //set ID
        for(var p=0; p<clientData.length;p++){                                      
            if (clientData[p][0] === parseInt(room)){                               //checking existing of room                             
                if(clientData[p].length<=2){                                        //checking number of player's
                    clientData[p].push(ID);                                         
                    CLIENT[ID] = ws;
                    clientValue[ID] = ID;
                    CLIENT.push(ws);
                    isRoomExisting = true;
                    console.log("Login user: "+ID+" Nick:"+nick+" Room "+room)
                    ws.send("ok");                                                  //response 
                }else{
                    isRoomExisting = true;
                    ws.send("full");
                }    
            }
        }
        if(!isRoomExisting){                                                        //creating room
            clientData[roomNumber] = [];
            clientData[roomNumber][0] = parseInt(room);
            clientData[roomNumber][1] = ID;
            CLIENT[ID] = ws;
            clientValue[ID] = ID;
            CLIENT.push(ws);
            roomNumber++;
            console.log("User: "+ID+" Nick:"+nick+" create room: "+room)
            ws.send("ok");
        }
        conuter++;
    
    ws.on("message", (msg) => {
        var s = msg.toString("utf-8");
        var messageRoomNumber=""; 
        var messageNick=""; 
        var message="";
        var j =0;
        console.log(s);

        while(s.charAt(j) !== ";"){                                             //separating Room number
            messageRoomNumber = messageRoomNumber + s.charAt(j);
            j++;
        }
        j++;

        while(s.charAt(j) !== ";"){                                             //separating Nick
            messageNick = messageNick + s.charAt(j);
            j++;
        }
        j++;
        
        for(var p =j; p<s.length; p++){                                         //separating messsage
            message = message+ s.charAt(p);
        }
        
        for(var c= 0; c<clientData.length; c++){                                //sending message to all player's in room
            if(messageRoomNumber === clientData[c][0]){
                var z = 1;
                for(var j = 0;j<CLIENT.length-1;j++){
                    if(clientValue[j] === clientData[c][z]){
                        CLIENT[j].send(messageNick+";"+message);
                        z++;console.log("Send");
                    }
                }
            }
        }
    });
    ws.on("close", (code, res) =>{
        console.log("close: "+res)
    })
});
server.listen(4000, () => {
    console.log("Server run on: 4000")
});