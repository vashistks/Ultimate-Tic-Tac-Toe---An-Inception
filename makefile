CC=g++
CFLAGS=-c -Wall
LDFLAGS= -lm


#this will be the name of your executable
PROJECT = project

#list a .o file for each .cpp file that you will compile
#this makefile will compile each cpp separately before linking
OBJECT = main.o controller/TTTController.o model/model.o 

#this target does the linking step  
all: ${PROJECT}

${PROJECT}: ${OBJECT}
	${CC} -o ${PROJECT} main.o TTTController.o model.o ${LDFLAGS}


#this target generically compiles each .cpp to a .o file
#it does not check for .h files dependencies, but you could add that
%.o: %.cpp
	${CC} -c ${CFLAGS} $<

#this will clean up all temporary files created by make all
clean:
	rm -rf *.o
	rm -rf *~
	rm -rf ${PROJECT} a.out






