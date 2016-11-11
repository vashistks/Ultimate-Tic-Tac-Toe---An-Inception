var playerJsonObj =
{
  boardstring:
  {

  },
  currentplayer:
  {

  },
  currentmarker:
  {

  },
  winstatus:
  {

  },
  playerinfo:
  {
    player1: {
      player1_name : {},
      player1_marker : {}
    },
    player2: {
      player2_name : {},
      player2_marker : {}
    }
  },
  players:
  {
    playerslist:[{
      players_name: {},
      players_marker: {},
      players_wins: {}
    }]
  },
  controllerMethod:
   {

   }
};

function Initdata(){
  gameplay("getplayers", {});
}

var cgiPath = "cgi-bin/main.cgi";

function players(methodName, input)
{
  playerJsonObj.controllerMethod.method = methodName;
  playerJsonObj.controllerMethod.input = input;
  var jsonObjStringPlayerSend = JSON.stringify(playerJsonObj);
  console.log("playerJsonObj data", playerJsonObj);
  console.log("playerJsonObj data to send to server", jsonObjStringPlayerSend);
  var xhttp1 = new XMLHttpRequest();
  xhttp1.open("POST", cgiPath, true);
  xhttp1.send(jsonObjStringPlayerSend);
}

function gameplay(methodName, input)
{
  playerJsonObj.controllerMethod.method = methodName;
  playerJsonObj.controllerMethod.input = input;
  var jsonObjStringGameSend = JSON.stringify(playerJsonObj);
  console.log("set data", playerJsonObj);
  console.log("set data to send", jsonObjStringGameSend);
  var xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var retJsonObj = JSON.parse(this.responseText);
    console.log("logging return",retJsonObj);
    if(retJsonObj.methodcalled == 'setSelection'){

    if(retJsonObj.winstatus == '0'){
      document.getElementById("result").innerHTML = retJsonObj.winstatus;
    }
    else if(retJsonObj.winstatus == '1'){
      document.getElementById("result").innerHTML = "Player 1 wins";
    }
    else if (retJsonObj.winstatus == '2'){
      document.getElementById("result").innerHTML = "player 2 wins";
    }
    else if (retJsonObj.winstatus == '3'){
      document.getElementById("result").innerHTML = "Match drawn";
    }
    playerJsonObj.boardstring = retJsonObj.displayselecteddata;
    playerJsonObj.currentplayer = retJsonObj.currentplayer;
    console.log("set selection response log :",playerJsonObj);
    }
    else if(retJsonObj.methodcalled == 'startGame')
    {
      playerJsonObj.boardstring = retJsonObj.displayboard;
      playerJsonObj.currentplayer = retJsonObj.currentplayer;
      console.log("playerJsonObj: ",playerJsonObj);
    }
    else if(retJsonObj.methodcalled == 'showplayers')
    {

      console.log("playerJsonObj: ",playerJsonObj);
    }
}
  };
  xhttp2.open("POST", cgiPath, true);
  xhttp2.send(jsonObjStringGameSend);
}

function togglePlayerInput(inputDiv){
  var divElement = document.getElementById(inputDiv);
  if(divElement.style.display == 'block')
        divElement.style.display = 'none';
    else
        divElement.style.display = 'block';
}

function createPlayer(num) {

  var player = {};
  if(num == '1'){
    player.name = document.getElementById("playername1").value;
    player.marker = document.getElementById("playermarker1").value;
    player.number = num;
    playerJsonObj.playerinfo.player1.player1_name = document.getElementById("playername1").value;
    playerJsonObj.playerinfo.player1.player1_marker = document.getElementById("playermarker1").value;
    playerJsonObj.players.playerslist.players_name = document.getElementById("playername1").value;
    playerJsonObj.players.playerslist.players_marker =document.getElementById("playermarker1").value;
  }
  else if(num == '2'){
    player.name = document.getElementById("playername2").value;
    player.marker = document.getElementById("playermarker2").value;
    player.number = num;
    playerJsonObj.playerinfo.player2.player2_name = document.getElementById("playername2").value;
    playerJsonObj.playerinfo.player2.player2_marker = document.getElementById("playermarker2").value;
    playerJsonObj.players.playerslist.players_name = document.getElementById("playername2").value;
    playerJsonObj.players.playerslist.players_marker = document.getElementById("playermarker2").value;
  }

  players("addPlayer", player);
}

function setSelection(selectionval){
  var currentplayer = playerJsonObj.currentplayer;
var currentmarker;
  if(currentplayer == '1'){
    currentmarker = playerJsonObj.playerinfo.player1.player1_marker;
    console.log(currentmarker);
  }
  else if(currentplayer == '2'){
    currentmarker = playerJsonObj.playerinfo.player2.player2_marker;
    console.log(currentmarker);
  }
playerJsonObj.currentmarker = currentmarker;
s = playerJsonObj.boardstring;
console.log(s);
  var selection = {};
  if(selectionval == '0')
  {  selection.row = 0;
     selection.col = 0;
  s = currentmarker + s.slice(1);
  playerJsonObj.boardstring = s;
  document.getElementById(selectionval).innerHTML= currentmarker;
 }
    else if(selectionval == '1')
  {
     selection.row = 0;
     selection.col = 1;
     console.log(s);
     s = s.slice(0,selectionval) + currentmarker + s.slice(2);
     playerJsonObj.boardstring = s;
     document.getElementById(selectionval).innerHTML= currentmarker;
 }
  else if(selectionval == '2')
  {
     selection.row = 0;
     selection.col = 2;
     var a = s.slice(0,selectionval);
     s = s.slice(0,selectionval) + currentmarker + s.slice(3);
     playerJsonObj.boardstring = s;
     document.getElementById(selectionval).innerHTML= currentmarker;
}
  else if(selectionval == '3')
  {
     selection.row = 1;
     selection.col = 0;
     s = s.slice(0,selectionval) + currentmarker + s.slice(4);
     playerJsonObj.boardstring = s;
     document.getElementById(selectionval).innerHTML= currentmarker;
}
  else if(selectionval == '4')
  {
     selection.row = 1;
     selection.col = 1;
s = s.slice(0,selectionval) + currentmarker + s.slice(5);
     playerJsonObj.boardstring = s;
     document.getElementById(selectionval).innerHTML= currentmarker;
}
  else if(selectionval == '5')
  {
     selection.row = 1;
     selection.col = 2;
s = s.slice(0,selectionval) + currentmarker + s.slice(6);
     playerJsonObj.boardstring = s;
     document.getElementById(selectionval).innerHTML= currentmarker;
 }
  else if(selectionval == '6')
  {
     selection.row = 2;
     selection.col = 0;
s = s.slice(0,selectionval) + currentmarker + s.slice(7);
     playerJsonObj.boardstring = s;
     document.getElementById(selectionval).innerHTML= currentmarker;
 }
  else if(selectionval == '7')
  {
     selection.row = 2;
     selection.col = 1;
s = s.slice(0,selectionval) + currentmarker + s.slice(8);
     playerJsonObj.boardstring = s;
     document.getElementById(selectionval).innerHTML= currentmarker;
}
  else if(selectionval == '8')
  {
     selection.row = 2;
     selection.col = 2;
     s = s.substr(0,selectionval)+currentmarker+s.substr(selectionval+1,s.length+1);
     playerJsonObj.boardstring = s;
     document.getElementById(selectionval).innerHTML= currentmarker;
}

  selection.marker = 'x';
  console.log(selection);
  gameplay("setSelection", selection);
}

function startGame(){
  gameplay("startGame","");
}

function showplayers(){
  gameplay("showplayers","");

}
