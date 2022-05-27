const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;
var wsopen, ws,room,nick;
var csend = false, cres = false;
var cs, cr,pp=0,pv=0;

var mp = document.getElementById("mpoints");        //acces to html
var rp = document.getElementById("rpoints");
var yc = document.getElementById("yourc");
var ec = document.getElementById("enec");
var co = document.getElementById("comment");

function check(){
    if(csend == true && cres == true){
        console.log(cs+" "+cr);
        if(cr=="rock"){                                         
            ec.innerHTML = '<img src="img/rock.png">'
            if(cs=="paper"){
                pp=pp+1; 
                yc.innerHTML = '<img src="img/papier.png">'
                co.textContent = "WIN!"
            }
            else if(cs=="scissors"){
                pv=pv+1;
                yc.innerHTML = '<img src="img/scissors.png">'
                co.textContent = "Defeat!"
            }
            else{
                co.textContent = "Draw!"
            }
        }else if(cr=="paper"){
            ec.innerHTML = '<img src="img/papier.png">'
            if(cs=="scissors"){
                pp=pp+1; 
                yc.innerHTML = '<img src="img/scissors.png">'
                co.textContent = "WIN!"
            }
            else if(cs=="rock"){
                pv=pv+1; 
                yc.innerHTML = '<img src="img/rock.png">'
                co.textContent = "Defeat!"
            }
            else{
                co.textContent = "Draw!"
            }
        }else if(cr=="scissors"){
            ec.innerHTML = '<img src="img/scissors.png">'
            if(cs=="rock"){
                pp=pp+1; 
                yc.innerHTML = '<img src="img/rock.png">'
                co.textContent = "WIN!"
            }
            else if(cs=="paper"){
                pv=pv+1;
                yc.innerHTML = '<img src="img/papier.png">'
                co.textContent = "Defeat!"
            }
            else{
                co.textContent = "Draw!"
            }
        }
        mp.textContent = pp;
        rp.textContent = pv
        csend=false;cres=false;
    }else if(csend == true && cres == false){
        console.log("oczekiwanie na przeciwnika");co.textContent = "Waiting for the opponent"
    }else if(csend == false && cres == true){
        co.textContent = "The enemy is waiting for you"
    }
}





function login(){
    room = document.getElementById("id").value;
    nick = document.getElementById("name").value;
    document.getElementById("main").style.display = "none";
    document.getElementById("game").style.display = "flex";
    ws = new WebSocket("ws://localhost:4000/?room="+room+"&nick="+nick);        //login to websocekt
    wsopen = true       
    ws.onmessage = (message) =>{                                                //on geting message                                        
        s=message.data
        if(s=="ok"){console.log("ok")
        }else{
            var ni=""; var mess="";var j =0;
            while(s.charAt(j) != ";"){ni = ni + s.charAt(j);j++}j++;
            if(ni!=nick){
                for(var p =j; p<s.length; p++){mess = mess+ s.charAt(p)}
                cr = mess;
                cres = true;
                check()
            }
           
        }
    }
}

function send(mes){                             //sending message
    ws.send(room+";"+nick+";"+mes);
    cs = mes;
    csend = true;
    check()
}
const closeBtn = document.getElementById("c");
const minimizeBtn = document.getElementById("h");
const refreshBtn = document.getElementById("m");

closeBtn.addEventListener("click", ()=>{
    if (wsopen == true){
        ws.close(1000,"end")
    }
    console.log("click")
    ipc.send("closeApp")
})

minimizeBtn.addEventListener("click", () => ipc.send("minimize-app"));

refreshBtn.addEventListener("click", () => ipc.send("reload-app"));