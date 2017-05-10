#include<stdio.h>
#include<stdlib.h>

#include<GL/glew.h>
#include<GLFW/glfw3.h>

double topLeftX, topLeftY, bottomRightX, bottomRightY;

void myMouseClick(GLFWwindow* window, int button, int action, int mods);
void myMouseMotion(GLFWwindow* window, double x, double y);
void myDisplay(GLFWwindow* window);

int main()
{
    glfwInit();

    GLFWwindow* window = glfwCreateWindow(400, 400, "Example 7", NULL, NULL);
    glfwMakeContextCurrent(window);

    glClearColor(0, 0, 0, 1);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(0, 1, 0, 1, -1, 1);

    glfwSetWindowRefreshCallback(window, myDisplay);
    glfwSetMouseButtonCallback(window, myMouseClick);
    glfwSetCursorPosCallback(window, myMouseMotion);
    
    myDisplay(window);
    while(!glfwWindowShouldClose(window))
    {
        glfwPollEvents();
    }
    return 0;
}

void myMouseClick(GLFWwindow* window, int button, int action, int mods)
{
    double x, y;
    glfwGetCursorPos(window, &x, &y);
    if (button == GLFW_MOUSE_BUTTON_LEFT && action == GLFW_PRESS)
    {
        topLeftX = x;
        topLeftY = y;
    }
}

void myMouseMotion(GLFWwindow* window, double x, double y)
{
    int state = glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT);
    fprintf(stdout, "mouse motion- %.2f / %.2f\n", x, y);
    if (state == GLFW_PRESS)
    {
        bottomRightX = x;
        bottomRightY = y;
        myDisplay(window);
    }
}

void myDisplay(GLFWwindow* window)
{
    fprintf(stdout, "draw display- %.2f / %.2f - %.2f / %.2f\n", topLeftX, topLeftY, bottomRightX, bottomRightY);
    glViewport(0, 0, 400, 400);
    glClear(GL_COLOR_BUFFER_BIT);
    glColor3f(1.0, 0.0, 0.0);
    glBegin(GL_POLYGON);
        glVertex3f(topLeftX/400.0, (400-topLeftY)/400.0, 0);
        glVertex3f(topLeftX/400.0, (400-bottomRightY)/400.0, 0);
        glVertex3f(bottomRightX/400.0, (400-bottomRightY)/400.0, 0);
        glVertex3f(bottomRightX/400.0, (400-topLeftY)/400.0, 0);
    glEnd();
    glFlush();
    glfwSwapBuffers(window);
}
