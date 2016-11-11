#include "model.h"
#include "../controller/TTTController.h"
#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include "../rapidjson/document.h"
#include "../rapidjson/writer.h"
#include "../rapidjson/stringbuffer.h"
gameplay::gameplay(){
  player_turn = 2;
}

gameplay::~gameplay(){

}

void gameplay::set_Marker(string name,string marker,int playerNum){
  player_name[playerNum-1] = name;
  player_marker[playerNum-1] = marker;
}

int gameplay::getCurrentPlayer(){
  return player_turn;
}

string gameplay::getCurrentPlayerJson(string playerJsonObj){
  std::size_t pos1 = playerJsonObj.find("currentplayer");
  string markerstr1 = playerJsonObj.substr(pos1);
  string currentPlayerstr = markerstr1.substr(16,1);
  return currentPlayerstr;
}

string gameplay::getCurrentPlayerName(){
    return player_name[player_turn-1];
}

string gameplay::switchturn(string player_turn){
string turn = player_turn;
  if(turn == "1"){
    turn= "2";
    }
  else
  {
    turn="1";
    }
    return turn;
  }

void gameplay::createBoard(){

for(int i=0;i<3;i++){
    for(int j=0;j<3;j++){
        board[i][j] = "-";
          }
       }
 for(int i=0;i<3;i++){
     for(int j=0;j<3;j++){
         outerboard[i][j] = "-";
           }
        }
  }

void gameplay::clearBoard(){
    for (int i = 0; i < 3; i++)
      {for (int j = 0; j < 3; j++){
        board[i][j] = "-";
            }
          }
  }

bool gameplay::checkfree(int row,int col){
  if(board[row][col] == "-"){
    return true;
    }
  else if(row>2 || col>2){
  return false;
    }
  else{
    return false;
    }
  }

void gameplay::updateboard(int row,int col,int currentPlayer){
    string updatemarker = player_marker[currentPlayer-1];
    board[row][col] = updatemarker;
  }

string gameplay::getCurrentBoard()
  {
  string board_string;
    for(int i=0;i<3;i++){
        for(int j=0;j<3;j++){
        //    cout << "currentboard" << board[i][j] << endl;
         board_string = board_string + board[i][j];
        }
      }
    return board_string;
  }

  string gameplay::getCurrentOuterBoard()
    {
    string board_string;
      for(int i=0;i<3;i++){
          for(int j=0;j<3;j++){
          //    cout << "currentboard" << board[i][j] << endl;
           board_string = board_string + outerboard[i][j];
          }
        }
      return board_string;
    }

string gameplay::getCurrentmarker(string playerJsonObj){
  std::size_t pos1 = playerJsonObj.find("currentmarker");
  string markerstr1 = playerJsonObj.substr(pos1);
  string currentmarkerstr = markerstr1.substr(16,1);
  return currentmarkerstr;
}

string gameplay::checkWin(string playerJsonObj){
  gameplay g2;
  // std::size_t strpos1 = playerJsonObj.find("boardstring");
  // std::string stringpos1 = playerJsonObj.substr(strpos1);
  // std::string strval = stringpos1.substr(14);
  // std::size_t strpos2 = strval.find("\"");
  // std::string jsonboardstring = strval.substr(0,strpos2);
  const char* incomingJson = playerJsonObj.c_str();
  rapidjson::Document d;
  d.Parse(incomingJson);
  rapidjson::Value& jsonboard = d["boardstring"];
  string jsonboardstring = jsonboard.GetString();
  g2.sendString(jsonboardstring);
  string currentPlayer = g2.getCurrentPlayerJson(playerJsonObj);
  string checkmarker = g2.getCurrentmarker(playerJsonObj);
// cout<<"board: "<<g2.board[0][0]<<endl;
// cout<<"board: "<<g2.board[0][1]<<endl;
// cout<<"board: "<<g2.board[0][2]<<endl;
// cout<<"board: "<<checkmarker<<endl;
  if(g2.board[0][0]==g2.board[0][1] && g2.board[0][1]==g2.board[0][2] && g2.board[0][2]==checkmarker)
    {return currentPlayer;}
  else if(g2.board[1][0]==g2.board[1][1] && g2.board[1][1]==g2.board[1][2] && g2.board[1][2]==checkmarker)
    {return currentPlayer;}
  else if(g2.board[2][0]==g2.board[2][1] && g2.board[2][1]==g2.board[2][2] && g2.board[2][2]==checkmarker)
    {return currentPlayer;}
  else if(g2.board[0][0]==g2.board[1][0] && g2.board[1][0]==g2.board[2][0] && g2.board[2][0]==checkmarker)
    {return currentPlayer;}
  else if(g2.board[0][1]==g2.board[1][1] && g2.board[1][1]==g2.board[2][1] && g2.board[2][1]==checkmarker)
    {return currentPlayer;}
  else if(g2.board[0][2]==g2.board[1][2] && g2.board[1][2]==g2.board[2][2] && g2.board[2][2]==checkmarker)
    {return currentPlayer;}
  else if(g2.board[0][0]==g2.board[1][1] && g2.board[1][1]==g2.board[2][2] && g2.board[2][2]==checkmarker)
    {return currentPlayer;}
  else if(g2.board[0][2]==g2.board[1][1] && g2.board[1][1]==g2.board[2][0] && g2.board[2][0]==checkmarker)
    {return currentPlayer;}
  else if(g2.board[0][0]!="-" && g2.board[0][1]!="-" && g2.board[0][2]!="-" && g2.board[1][0]!="-" && g2.board[1][1]!="-" && g2.board[1][2]!="-" && g2.board[2][0]!="-" && g2.board[2][1]!="-" && g2.board[2][2]!="-" ){
  return "3";
    }
  else
    {
      return "0";
    }
}

void gameplay::sendString(string jsonboardstring){
  string boardstring = jsonboardstring;
  //cout<<"board"<<boardstring<<endl;
  int k=0;
    for(int i=0;i<3;i++){
      for(int j=0;j<3;j++){
        //cout<< "boardstringk" << boardstring[k] << endl;
    board[i][j] = boardstring[k];
    k++;
    //cout<<i<<j<<board[i][j]<<endl;
      }
    }
}

void gameplay::sendOuterString(string jsonboardstring){
  string outerboardstring = jsonboardstring;
  //cout<<"outer"<<outerboardstring<<endl;
  int k=0;
    for(int i=0;i<3;i++){
      for(int j=0;j<3;j++){
        //cout<< "boardstringk" << boardstring[k] << endl;
    outerboard[i][j] = outerboardstring[k];
    k++;
    //cout<<i<<j<<outerboard[i][j]<<endl;
      }
    }

}

string gameplay::checkOuterWin(string playerJsonObj,string outerstring){
gameplay g2;
//cout<<"complete"<<endl;
const char* incomingJson = playerJsonObj.c_str();
rapidjson::Document d;
d.Parse(incomingJson);
//rapidjson::Value& jsonboard = d["outerstring"];
string jsonboardstring = outerstring; //jsonboard.GetString();
g2.sendOuterString(jsonboardstring);
string currentPlayer = g2.getCurrentPlayerJson(playerJsonObj);
string checkmarker = g2.getCurrentmarker(playerJsonObj);
//string currentPlayer = "1";
if(g2.outerboard[0][0]==g2.outerboard[0][1] && g2.outerboard[0][1]==g2.outerboard[0][2] && g2.outerboard[0][2]==checkmarker)
  {return currentPlayer;}
else if(g2.outerboard[1][0]==g2.outerboard[1][1] && g2.outerboard[1][1]==g2.outerboard[1][2] && g2.outerboard[1][2]==checkmarker)
  {return currentPlayer;}
else if(g2.outerboard[2][0]==g2.outerboard[2][1] && g2.outerboard[2][1]==g2.outerboard[2][2] && g2.outerboard[2][2]==checkmarker)
  {return currentPlayer;}
else if(g2.outerboard[0][0]==g2.outerboard[1][0] && g2.outerboard[1][0]==g2.outerboard[2][0] && g2.outerboard[2][0]==checkmarker)
  {return currentPlayer;}
else if(g2.outerboard[0][1]==g2.outerboard[1][1] && g2.outerboard[1][1]==g2.outerboard[2][1] && g2.outerboard[2][1]==checkmarker)
  {return currentPlayer;}
else if(g2.outerboard[0][2]==g2.outerboard[1][2] && g2.outerboard[1][2]==g2.outerboard[2][2] && g2.outerboard[2][2]==checkmarker)
  {return currentPlayer;}
else if(g2.outerboard[0][0]==g2.outerboard[1][1] && g2.outerboard[1][1]==g2.outerboard[2][2] && g2.outerboard[2][2]==checkmarker)
  {return currentPlayer;}
else if(g2.outerboard[0][2]==g2.outerboard[1][1] && g2.outerboard[1][1]==g2.outerboard[2][0] && g2.outerboard[2][0]==checkmarker)
  {return currentPlayer;}
else if(g2.outerboard[0][0]!="-" && g2.outerboard[0][1]!="-" && g2.outerboard[0][2]!="-" && g2.outerboard[1][0]!="-" && g2.outerboard[1][1]!="-" && g2.outerboard[1][2]!="-" && g2.outerboard[2][0]!="-" && g2.outerboard[2][1]!="-" && g2.outerboard[2][2]!="-" ){
return "3";
  }
else
  {
    return "0";
  }

}

string gameplay::updateOuterString(string outerstring,string currentmarker,string currentouter){
  string changestring = outerstring;
  string c = currentmarker;

  int out = atoi(currentouter.c_str());//stoi(currentouter);
  out = out - 1;
  changestring.replace(out,1,c);
return changestring;
}
