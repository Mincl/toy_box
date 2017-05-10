#include<cstdio>
#include<cstdlib>

#include<GL/glew.h>
#include<GLFW/glfw3.h>

void display(GLFWwindow *window)
{
    glClear(GL_COLOR_BUFFER_BIT);
    glViewport(0, 0, 500, 500);
    glMatrixMode(GL_MODELVIEW);

    // red cube
    glColor3f(1.0, 0.0, 0.0);
    glLoadIdentity(); // initialize current modelview matrix to identity matrix
    glRectf(0.3, 0.3, 0.3, 0.3);

    // green cube
    glColor3f(0.0, 1.0, 0.0);
    glLoadIdentity();
    glRotatef(45.0, 0.0, 0.0, 1.0);
    glTranslatef(0.6, 0.0, 0.0);
    glRectf(0.3, 0.3, 0.3, 0.3);

    // blue cube
    glColor3f(0.0, 0.0, 1.0);
    glLoadIdentity();
    glTranslatef(0.6, 0.0, 0.0);
    glRotatef(45.0, 0.0, 0.0, 1.0);
    glRectf(0.3, 0.3, 0.3);
    glFlush();

    glfwSwapBuffers(window);
}

int main()
{
    if (!glfwInit())
    {
        fprintf(stderr, "Failed initialize GLFW");
        exit(EXIT_FAILURE);
    }
    GLFWwindow *window = glfwCreateWindow(500, 500, "example_2", NULL, NULL);
    if (!window)
    {
        fprintf(stderr, "Failed to create GLFW window");
        glfwTerminate();
        exit(EXIT_FAILURE);
    }
    glfwMakeContextCurrent(window);

    while(!glfwWindowShouldClose(window))
    {
        display(window);
    }
    return 0;
}
