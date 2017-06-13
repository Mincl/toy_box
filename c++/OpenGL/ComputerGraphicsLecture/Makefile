
OBJS = opengl.cpp lib/*.cpp

CC = g++

INCLUDE_PATHS = -I/usr/local/include
LIBRARY_PATHS = -L/user/local/lib

COMPILER_FLAGS = -w

LINKER_FLAGS = -framework OpenGL -lglfw3 -lglew
DEBUG_FLAGS = -g

OBJ_NAME = run

all : $(OBJS); $(CC) $(OBJS) $(INCLUDE_PATHS) $(LIBRARY_PATHS) $(COMPILER_FLAGS) $(LINKER_FLAGS) $(DEBUG_FLAGS) -o $(OBJ_NAME)

