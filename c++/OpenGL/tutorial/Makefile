
#OBJS = tutorial.cpp
#OBJS = example.cpp
#OBJS = example_2.cpp
OBJS = mouse_callback.cpp

CC = g++

INCLUDE_PATHS = -I/usr/local/include
LIBRARY_PATHS = -L/user/local/lib

COMPILER_FLAGS = -w

LINKER_FLAGS = -framework OpenGL -lglfw3 -lglew

OBJ_NAME = run

all : $(OBJS); $(CC) $(OBJS) $(INCLUDE_PATHS) $(LIBRARY_PATHS) $(COMPILER_FLAGS) $(LINKER_FLAGS) -o $(OBJ_NAME)

