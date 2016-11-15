#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include "TTTController.h"
#include "../model/model.h"
#include "../rapidjson/document.h"
#include "../rapidjson/writer.h"
#include "../rapidjson/stringbuffer.h"

void TTTController::createPlayer(string playerJsonObj)
 {
   ofstream file;
   file.open("op.txt");
   std::size_t pos = playerJsonObj.find("marker");
   string markerstr = playerJsonObj.substr(pos);
   std::string marker = markerstr.substr(9,1);
   file<<marker;
   std::size_t pos1 = playerJsonObj.find("name");
   std::string namestr = playerJsonObj.substr(pos1);
   std::string nameval = namestr.substr(7);
   std::size_t pos2 = nameval.find("\"");
   std::string name = nameval.substr(0,pos2);
   file<<name;
   file.close();
   int playerNum = 1;
  g1.set_Marker(name,marker,playerNum);
 }

void TTTController::startNewGame()
  {
    g1.createBoard();
  }

void TTTController::displayboard()
  {
    string board[3][3];
      string boardstring = g1.getCurrentBoard();
    int k=0;
      for(int i=0;i<3;i++){
        for(int j=0;j<3;j++){
      board[i][j] = boardstring[k];
      k++;
        }
      }
  }

  string TTTController::getAllSavedPlayers(string playerJsonObj){
    string players = playerJsonObj;
    std::string getplayers = "{\"methodcalled\":\"showplayers2\",\"players\":\""+players+"\"}";
    cout<<getplayers;
    return getplayers;
}

string TTTController::getAllSavedPlayers(){
  string players = g1.getJsonInFile();
  std::string getplayers = "{\"methodcalled\":\"showplayers\",\"players\":\""+players+"\"}";
  cout<<getplayers;
  return getplayers;
}

void TTTController::updatesavedjson(string playerJsonObj){
  g1.updateJsonInFile(playerJsonObj);
}

string TTTController::do_selection(string playerJsonObj)
{
  TTTController t;
  bool avail = t.setSelection(playerJsonObj);
  const char* incomingJson = playerJsonObj.c_str();
  rapidjson::Document d;
  d.Parse(incomingJson);
  ostringstream ss;
  ss << boolalpha << avail;
  std::string avail1 = ss.str();
  string display = t.getGameDisplay();
  string curplayer = g1.getCurrentPlayerJson(playerJsonObj);
  string nextplayer = g1.switchturn(curplayer);
  string currentmarker = g1.getCurrentmarker(playerJsonObj);
  rapidjson::Value& souterstring = d["outerstring"];
  string outerstring = souterstring.GetString();
  rapidjson::Value& scurrentouter = d["currentouter"];
  string currentouter = scurrentouter.GetString();
  rapidjson::Value& scurrentinner = d["controllerMethod"]["input"]["currentinner"];
  string currentinner = scurrentinner.GetString();
  string winstatus = g1.checkWin(playerJsonObj);
  if(winstatus == "1"){

    outerstring = g1.updateOuterString(outerstring,currentmarker,currentouter);
  }
  else if(winstatus == "2"){
    outerstring = g1.updateOuterString(outerstring,currentmarker,currentouter);
  }
  string outerwinstatus = g1.checkOuterWin(playerJsonObj,outerstring);
  std::string tempavail = "{\"methodcalled\":\"setSelection\",\"bool\": "+avail1+",\"currentinner\":\""+currentinner+"\",\"displayselecteddata\": \""+display+"\",\"currentplayer\" : \""+nextplayer+"\",\"winstatus\":\""+winstatus+"\",\"outerstring\":\""+outerstring+"\",\"currentouter\":\""+currentouter+"\",\"outerwinstatus\":\""+outerwinstatus+"\"}";
  cout<<tempavail;
  return display;
}

bool TTTController::setSelection(string playerJsonObj)
  {
    const char* incomingJson = playerJsonObj.c_str();
    rapidjson::Document d;
    d.Parse(incomingJson);
    rapidjson::Value& srow = d["controllerMethod"]["input"]["row"];
    rapidjson::Value& scol = d["controllerMethod"]["input"]["col"];
    int row = srow.GetInt();
    int col = scol.GetInt();
    rapidjson::Value& jsonboard = d["boardstring"];
    string jsonboardstring = jsonboard.GetString();
    g1.sendString(jsonboardstring);
    //g1.sendOuterString(jsonboardstring);
    string cp = g1.getCurrentPlayerJson(playerJsonObj);
    int currentPlayer = 1;
    bool availability;
    if(row<3 && col <3){
      availability = g1.checkfree(row,col);
      if(availability == true){
        g1.updateboard(row,col,currentPlayer);
      }
      else{

      }
    }

    return availability;
  }

int TTTController::currentPlayer(){
  return g1.getCurrentPlayer();
}

string TTTController::currentPlayerName(){
  return g1.getCurrentPlayerName();
}

string TTTController::getGameDisplay()
{
    string boardstring = g1.getCurrentBoard();
  int k=0;
    for(int i=0;i<3;i++){
      for(int j=0;j<3;j++){

    k++;
      }
    }
return boardstring;
}

string TTTController::getOuterGameDisplay()
{
    string outerboardstring = g1.getCurrentOuterBoard();
  int k=0;
    for(int i=0;i<3;i++){
      for(int j=0;j<3;j++){

    k++;
      }
    }
return outerboardstring;
}

void TTTController::restartGame(){
  
  string game = "{\"methodcalled\":\"restartGame\",\"board\":\"---------\",\"currentplayer\":\"1\"}";
  cout<<game;
}
