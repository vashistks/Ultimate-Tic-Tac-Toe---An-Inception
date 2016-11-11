#include <iostream>
#include <cstring>
#include "controller/TTTController.h"
#include <sstream>
#include <fstream>
#include "rapidjson/document.h"
#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"
using namespace rapidjson;

void run();
int main()
{
  cout << "content-type: text/html\n\n";
    stringstream post;
    post << cin.rdbuf();
    string incomingJsonObjectString = post.str();
    TTTController controller;

const char* incomingJson = incomingJsonObjectString.c_str();
rapidjson::Document d;
d.Parse(incomingJson);
rapidjson::Value& s = d["controllerMethod"]["method"];
string methodname = s.GetString();

if(methodname == "addPlayer"){
  controller.createPlayer(incomingJsonObjectString);
}
else if(methodname == "setSelection"){
  string display = controller.do_selection(incomingJsonObjectString);
}
else if(methodname == "startGame"){
  controller.startNewGame();
  string display = controller.getGameDisplay();
  string outerdisplay = controller.getOuterGameDisplay();
  string jsondisplay = "{\"methodcalled\":\"startGame\",\"displayboard\":\""+display+"\",\"currentplayer\":\"1\",\"outerstring\":\""+outerdisplay+"\"}";
  cout<<jsondisplay;
}

else if(methodname == "showplayers"){
  string players = controller.getAllSavedPlayers(incomingJsonObjectString);
}
else if(methodname == "restartGame"){
controller.restartGame();
}

}
