var playerJsonObj =
{
  boardstring:{},
  currentplayer:{},
  currentmarker:{},
  winstatus:{},
  currentouter: {},
  outerstring: {},
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
  [{
        players_name : "Sample",
        players_marker: "p",
        uwins:0,
        uloss:0,
        utie:0
  }],
  allboardstring:
  {
    boardstring1: {},
    boardstring2: {},
    boardstring3: {},
    boardstring4: {},
    boardstring5: {},
    boardstring6: {},
    boardstring7: {},
    boardstring8: {},
    boardstring9: {}
  },
  disabledblocks:[],
  controllerMethod:{}
};

function Initdata(){
  gameplay("getplayers", {});
}

var cgiPath = "cgi-bin/main.cgi";

function updatesavedjson(){
  gameplay('updatesavedjson',"");
}

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
    console.log("logging return object",retJsonObj);
    if(retJsonObj.methodcalled == 'setSelection'){
      document.getElementById("result2").innerHTML = retJsonObj.outerstring;
      playerJsonObj.outerstring = retJsonObj.outerstring;
      var divboard = retJsonObj.currentouter;
      var boardstring = retJsonObj.displayselecteddata;
      var currentplayer = retJsonObj.currentplayer;
      document.getElementById("turn").innerHTML = "Player " + currentplayer + " with marker " + getCurrentmarker(currentplayer) + " play";
      addToAllboard(boardstring,divboard);
        if(retJsonObj.winstatus == '0'){
          document.getElementById("result").innerHTML = retJsonObj.winstatus;
        }
        else if(retJsonObj.winstatus == '1'){
          var outermarker = getprevmarker(currentplayer);
          var curboard = 'boardstring' + divboard;
          playerJsonObj['allboardstring'][curboard] = outermarker;
          alert("Player 1 wins box" + retJsonObj.currentouter);
          document.getElementById("result").innerHTML = "Player 1 wins box" + retJsonObj.currentouter;
          playerJsonObj['disabledblocks'].push(divboard);// = divboard;
          var selection = --divboard;
          var setselection = retJsonObj.currentinner;
          enableTable(setselection);
        }
        else if (retJsonObj.winstatus == '2'){
          var outermarker = getprevmarker(currentplayer);
          var curboard = 'boardstring' + divboard;
          playerJsonObj['allboardstring'][curboard] = outermarker;
          alert("Player 2 wins box" + retJsonObj.currentouter);
          document.getElementById("result").innerHTML = "player 2 wins box" + retJsonObj.currentouter;
          playerJsonObj['disabledblocks'].push(divboard);
          var selection = --divboard;
          var setselection = retJsonObj.currentinner;
          enableTable(setselection);
        }
        else if (retJsonObj.winstatus == '3'){
          var curboard = 'boardstring' + divboard;
          playerJsonObj['allboardstring'][curboard] = '3';
          document.getElementById("result").innerHTML = "Match drawn at box" + retJsonObj.currentouter;
          playerJsonObj['disabledblocks'].push(divboard);
          var selection = --divboard;
          var setselection = retJsonObj.currentinner;
          enableTable(setselection);
        }
        var outerwinstatus = retJsonObj.outerwinstatus;
        if(outerwinstatus == '1' || outerwinstatus == '2' || outerwinstatus == '3'){

          updatestats(outerwinstatus);
          cleartable();
        }

      playerJsonObj.currentplayer = currentplayer;
      console.log("playerJsonObj after set selection return :",playerJsonObj);
    }
    else if(retJsonObj.methodcalled == 'startGame')
    {
      playerJsonObj.boardstring = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring1 = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring2 = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring3 = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring4 = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring5 = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring6 = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring7 = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring8 = retJsonObj.displayboard;
      playerJsonObj.allboardstring.boardstring9 = retJsonObj.displayboard;
      playerJsonObj.currentplayer = retJsonObj.currentplayer;
      playerJsonObj.outerstring = retJsonObj.outerstring;
      console.log("playerJsonObj: ",playerJsonObj);
    }
    else if(retJsonObj.methodcalled == 'showplayers')
    {
      console.log("playerJsonObj: ",playerJsonObj);
    }
    else if(retJsonObj.methodcalled == 'restartGame'){
      playerJsonObj.boardstring = retJsonObj.board;
      playerJsonObj.currentplayer = retJsonObj.currentplayer;
      playerJsonObj.currentmarker = {};
      playerJsonObj.winstatus = {};
      playerJsonObj.currentouter = {};
      playerJsonObj.outerstring = retJsonObj.board;
      for(var i=1;i<10;i++){
        var b = 'boardstring' + i;
        playerJsonObj['allboardstring'][b] = {};
      }
      playerJsonObj.disabledblocks = [];
      playerJsonObj.controllerMethod = {};
      console.log(playerJsonObj);
      cleartable();
      gameplay("startGame","");
    }
}
  };
  xhttp2.open("POST", cgiPath, true);
  xhttp2.send(jsonObjStringGameSend);
}

function updatestats(outerwinstatus){
var arr = playerJsonObj.players;
  if(outerwinstatus == '1'){
    var name = playerJsonObj.playerinfo.player1.player1_name;
    var arr = playerJsonObj.players;
    for(var i in arr){
      if(arr[i]['players_name'] == name){
        var count = arr[i]['uwins'];
        ++count;
        arr[i]['uwins'] = count;
        var count2 = arr[i]['uloss'];
        ++count2;
        arr[i]['uloss'] = count2;
      }
    }
    updatesavedjson();
    document.getElementById("result").innerHTML = "PLAYER 1 WINS THE GAME";
    document.getElementById("result2").innerHTML = "PLAYER 1 WINS THE GAME";
    document.getElementById("turn").innerHTML = "PLAYER 1 WINS THE GAME";
    alert('Player 1 wins');

    }
  else if (outerwinstatus == '2') {
    var name = playerJsonObj.playerinfo.player2.player2_name;
    var arr = playerJsonObj.players;
    for(var i in arr){
      if(arr[i]['players_name'] == name){
        var count = arr[i]['uwins'];
        ++count;
        arr[i]['uwins'] = count;
        var count2 = arr[i]['uloss'];
        ++count2;
        arr[i]['uloss'] = count2;
      }
    }
    updatesavedjson();
    document.getElementById("result").innerHTML = "PLAYER 2 WINS THE GAME";
    document.getElementById("result2").innerHTML = "PLAYER 2 WINS THE GAME";
    document.getElementById("turn").innerHTML = "PLAYER 2 WINS THE GAME";
    alert('Player 2 wins');
    }
  else if (outerwinstatus == '3') {
    var name1 = playerJsonObj.playerinfo.player1.player1_name;
    var name2 = playerJsonObj.playerinfo.player2.player2_name;
    var arr = playerJsonObj.players;
    for(var i in arr){
      if(arr[i]['players_name'] == name){
        var count1 = arr[i]['utie'];
        ++count1;
        arr[i]['utie'] = count1;
      }
      if(arr[i]['players_name'] == name){
        var count2 = arr[i]['utie'];
        ++count2;
        arr[i]['utie'] = count2;
      }
    }
    updatesavedjson();
    document.getElementById("result").innerHTML = "IT'S A TIE";
    document.getElementById("result2").innerHTML = "IT'S A TIE";
    document.getElementById("turn").innerHTML = "IT'S A TIE";
    alert('Its a tie');
    }
}

function cleartable() {
  for(var i=1;i<10;i++){
    for(var j=0;j<9;j++){
      var div = 'outerboard' + i;
      var divElement = document.getElementById(div);
      divElement.getElementsByTagName("td")[j].innerHTML = "";
    }
  }
  enableAllTables();
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

    playerJsonObj.playerinfo.player1.player1_name = document.getElementById("playername1").value;
    playerJsonObj.playerinfo.player1.player1_marker = document.getElementById("playermarker1").value;
    player['players_name'] = document.getElementById("playername1").value;
    player['players_marker'] = document.getElementById("playermarker1").value;
    player
    player['uwins'] = 0;
    player['uloss'] = 0 ;
    player['utie'] = 0;
    playerJsonObj['players'].push(player);
    console.log(playerJsonObj.players);
    alert("player1 created, now create player 2");
  }
  else if(num == '2'){
    if(document.getElementById("playermarker2").value == playerJsonObj.playerinfo.player1.player1_marker){
      document.getElementById("result").innerHTML = "SAME MARKER AS PLAYER 1";
      document.getElementById("result2").innerHTML = "SAME MARKER AS PLAYER 1";
      document.getElementById("turn").innerHTML = "SAME MARKER AS PLAYER 1";
    }
    else {
    playerJsonObj.playerinfo.player2.player2_name = document.getElementById("playername2").value;
    playerJsonObj.playerinfo.player2.player2_marker = document.getElementById("playermarker2").value;
    player['players_name'] = document.getElementById("playername2").value;
    player['players_marker'] = document.getElementById("playermarker2").value;
    player['uwins'] = 0;
    player['uloss'] = 0;
    player['utie'] = 0;
    playerJsonObj['players'].push(player);

    alert("player2 created, now Start game");
  }
}

  players("addPlayer", player);
}



function startGame(){
  updatesavedjson();
  gameplay("startGame","");
}

function restartGame(){
  gameplay("restartGame","");
}

function startUltimateGame(){
  gameplay("startUltimateGame","");
}

function showplayers(){
  //gameplay("showplayers","");
  var vList = document.getElementById("List");
  			var players = playerJsonObj.players;
  			for(var i=0; i<players.length; i++){
  				var listItem = document.createElement("li"); // Create a <li> node
  				var v = players[i];
  				var playDescr = document.createTextNode("Name: " + v.players_name+", marker : "+v.players_marker+", uwins: "+ v.uwins +", uloss: "+ v.uloss + " utie: "+ v.utie );
  				listItem.appendChild(playDescr);
  				vList.appendChild(listItem);
  			}
}

function getOuterRow(divboard) {
var row;
  if(divboard == '1') { row = 0; }
  else if(divboard == '2') { row = 0; }
  else if(divboard == '3') { row = 0; }
  else if(divboard == '4') { row = 1; }
  else if(divboard == '5') { row = 1; }
  else if(divboard == '6') { row = 1; }
  else if(divboard == '7') { row = 2; }
  else if(divboard == '8') { row = 2; }
  else if(divboard == '9') { row = 2; }
return row;
}

function getOuterCol(divboard) {
var col;
  if(divboard == '1') { col = 0; }
  else if(divboard == '2') { col = 1; }
  else if(divboard == '3') { col = 2; }
  else if(divboard == '4') { col = 0; }
  else if(divboard == '5') { col = 1; }
  else if(divboard == '6') { col = 2; }
  else if(divboard == '7') { col = 0; }
  else if(divboard == '8') { col = 1; }
  else if(divboard == '9') { col = 2; }
return col;
}

function getprevmarker(currentplayer){
  if(currentplayer == '1'){
  currentmarker = playerJsonObj.playerinfo.player2.player2_marker;
  }
  else if(currentplayer == '2'){
  currentmarker = playerJsonObj.playerinfo.player1.player1_marker;
  }
  return currentmarker
}

function getCurrentmarker(currentplayer){

  if(currentplayer == '1'){
  var cur = playerJsonObj.playerinfo.player1.player1_marker;
  }
  else if(currentplayer == '2'){
  var cur = playerJsonObj.playerinfo.player2.player2_marker;
  }
  return cur;
}

function setSelection(selectionval,divboard){
  var div = 'outerboard' + divboard;
  var divElement = document.getElementById(div);
  if(divElement.getElementsByTagName("td")[selectionval].innerHTML != ""){
    console.log('ERRRRROORRRR');
    alert('Wrong play');
    document.getElementById("result").innerHTML = "Wrong Play";
    document.getElementById("result2").innerHTML = "Wrong Play";
    document.getElementById("turn").innerHTML = "Wrong Play";
  }
  else {
  var currentplayer = playerJsonObj.currentplayer;
  var currentmarker = getCurrentmarker(currentplayer);
  var marker1 = playerJsonObj.playerinfo.player1.player1_marker;
  var marker2 = playerJsonObj.playerinfo.player2.player2_marker;
  playerJsonObj.currentmarker = currentmarker;
  playerJsonObj.currentouter = divboard;
  var currentstring = 'boardstring' + divboard;
  var s;
  s = playerJsonObj['allboardstring'][currentstring];
  enableTable(selectionval);
  var outerRow = getOuterRow(divboard);
  var outerCol = getOuterCol(divboard);
  var selection = {};
  selection.currentinner = selectionval;
  selection.outerstring = playerJsonObj.outerstring;
  selection.outerRow = outerRow;
  selection.outerCol = outerCol;
    if(selectionval == '0')
    {
      if(s == marker1 || s == marker2 || s == '3'){
      alert('invalid entry');}
      else {
        selection.row = 0;
        selection.col = 0;
        s = currentmarker + s.slice(1);
        playerJsonObj.boardstring = s;
        divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;
      }
    }
      else if(selectionval == '1')
    {
      if(s == marker1 || s == marker2 || s == '3'){
      alert('invalid entry');}
      else {
       selection.row = 0;
       selection.col = 1;
       s = s.slice(0,selectionval) + currentmarker + s.slice(2);
       playerJsonObj.boardstring = s;
       divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;
   }}
    else if(selectionval == '2')
    {
      if(s == marker1 || s == marker2 || s == '3'){
      alert('invalid entry');}
      else {
       selection.row = 0;
       selection.col = 2;
       var a = s.slice(0,selectionval);
       s = s.slice(0,selectionval) + currentmarker + s.slice(3);
       playerJsonObj.boardstring = s;
       divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;   }}
    else if(selectionval == '3')
    {
      if(s == marker1 || s == marker2 || s == '3'){
      alert('invalid entry');}
      else {
       selection.row = 1;
       selection.col = 0;
       s = s.slice(0,selectionval) + currentmarker + s.slice(4);
       playerJsonObj.boardstring = s;
       divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;  }}
    else if(selectionval == '4')
    {
      if(s == marker1 || s == marker2 || s == '3'){
      alert('invalid entry');}
      else {
       selection.row = 1;
       selection.col = 1;
       s = s.slice(0,selectionval) + currentmarker + s.slice(5);
       playerJsonObj.boardstring = s;
       divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;
  }}
    else if(selectionval == '5')
    {
      if(s == marker1 || s == marker2 || s == '3'){
      alert('invalid entry');}
      else {
       selection.row = 1;
       selection.col = 2;
       s = s.slice(0,selectionval) + currentmarker + s.slice(6);
       playerJsonObj.boardstring = s;
       divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;
   }}
    else if(selectionval == '6')
    {
      if(s == marker1 || s == marker2 || s == '3'){
      alert('invalid entry');}
      else {
       selection.row = 2;
       selection.col = 0;
       s = s.slice(0,selectionval) + currentmarker + s.slice(7);
       playerJsonObj.boardstring = s;
       divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;
   }}
    else if(selectionval == '7')
    {
      if(s == marker1 || s == marker2 || s == '3'){
      alert('invalid entry');}
      else {
       selection.row = 2;
       selection.col = 1;
       s = s.slice(0,selectionval) + currentmarker + s.slice(8);
       playerJsonObj.boardstring = s;
       divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;
  }}
    else if(selectionval == '8')
  {
    if(s == marker1 || s == marker2 || s == '3'){
    alert('invalid entry');}
    else {
     selection.row = 2;
     selection.col = 2;
     s = s.substr(0,selectionval)+currentmarker+s.substr(selectionval+1,s.length+1);
     playerJsonObj.boardstring = s;
     divElement.getElementsByTagName("td")[selectionval].innerHTML = currentmarker;
  }}
  var boardstring = playerJsonObj.boardstring;
  addToAllboard(boardstring,divboard);
  gameplay("setSelection", selection);
  }
}

function addToAllboard(boardstring,divboard){
  if(divboard == '1'){playerJsonObj.allboardstring.boardstring1 = boardstring}
  else  if(divboard == '2'){playerJsonObj.allboardstring.boardstring2 = boardstring}
  else  if(divboard == '3'){playerJsonObj.allboardstring.boardstring3 = boardstring}
  else  if(divboard == '4'){playerJsonObj.allboardstring.boardstring4 = boardstring}
  else  if(divboard == '5'){playerJsonObj.allboardstring.boardstring5 = boardstring}
  else  if(divboard == '6'){playerJsonObj.allboardstring.boardstring6 = boardstring}
  else  if(divboard == '7'){playerJsonObj.allboardstring.boardstring7 = boardstring}
  else  if(divboard == '8'){playerJsonObj.allboardstring.boardstring8 = boardstring}
  else  if(divboard == '9'){playerJsonObj.allboardstring.boardstring9 = boardstring}
}


function enableTable(selectionval){
  var inc = ++selectionval;
  var outerboard = '#outerboard' + inc;
  var arr = playerJsonObj.disabledblocks;
  console.log('blocked array length', arr.length);
  enableAllTables();
  if(arr == ""){
    disableAllTables();
    console.log('disabled blocks r empty');
    $(outerboard).each(function()
    {
      this.style.pointerEvents = 'auto';
    });
  }
  else {
    disableallblockedTables();
    for(var i in arr){
      console.log('inc',inc);
      if(inc.toString() == arr[i]){
        console.log('arr',arr[i]);
        console.log("last selection matches one of the blocked tables, so enable all");
        disableallblockedTables();
        break;
      }
      else{
        disableAllTables();
        console.log('going to selection table');
        $(outerboard).each(function()
        {
          this.style.pointerEvents = 'auto';
        });
      }
    }
  }
}

function disableallblockedTables(){
  enableAllTables();
  var arr = playerJsonObj.disabledblocks;
  for(var i in arr){
    var num = arr[i];
    var outerboard = '#outerboard' + num;
    console.log('goin to block ',outerboard);
    $(outerboard).each(function()
         {
             this.style.pointerEvents = 'none';
           });
         }
}

function disableAllTables(){
  $('#outerboard1').each(function()
       {
           this.style.pointerEvents = 'none';
       });
  $('#outerboard2').each(function()
       {
           this.style.pointerEvents = 'none';
       });
   $('#outerboard3').each(function()
        {
            this.style.pointerEvents = 'none';
        });
    $('#outerboard4').each(function()
         {
             this.style.pointerEvents = 'none';
         });
   $('#outerboard5').each(function()
        {
            this.style.pointerEvents = 'none';
        });
    $('#outerboard6').each(function()
         {
             this.style.pointerEvents = 'none';
         });
   $('#outerboard7').each(function()
          {
              this.style.pointerEvents = 'none';
          });
    $('#outerboard8').each(function()
           {
               this.style.pointerEvents = 'none';
           });
   $('#outerboard9').each(function()
          {
              this.style.pointerEvents = 'none';
          });
}

function enableAllTables(){
  $('#outerboard1').each(function()
       {
           this.style.pointerEvents = 'auto';
       });
  $('#outerboard2').each(function()
       {
           this.style.pointerEvents = 'auto';
       });
   $('#outerboard3').each(function()
        {
            this.style.pointerEvents = 'auto';
        });
    $('#outerboard4').each(function()
         {
             this.style.pointerEvents = 'auto';
         });
   $('#outerboard5').each(function()
        {
            this.style.pointerEvents = 'auto';
        });
    $('#outerboard6').each(function()
         {
             this.style.pointerEvents = 'auto';
         });
   $('#outerboard7').each(function()
          {
              this.style.pointerEvents = 'auto';
          });
    $('#outerboard8').each(function()
           {
               this.style.pointerEvents = 'auto';
           });
   $('#outerboard9').each(function()
          {
              this.style.pointerEvents = 'auto';
          });
}
