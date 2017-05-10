#include<cstdio>
#include<cstdlib>

#include<GL/glew.h>
#include<GLFW/glfw3.h>

void reshape(GLFWwindow *window, int w, int h)
{
    glLoadIdentity();
    glViewport(0, 0, w, h);
    gluOrtho2D(0.0, 100.0, 0.0, 100.0);
}

void display(GLFWwindow *window)
{
    glClear(GL_COLOR_BUFFER_BIT);
    glColor3f(1.0, 0.0, 0.0);
    glRectf(30.0, 30.0, 50.0, 50.0);

    glBegin(GL_TRIANGLES);
        glVertex3f(5.0, 5.0, 0.0);
        glVertex3f(10.0, 10.0, 0.0);
        glVertex3f(5.0, 10.0, 0.0);

        glVertex3f(15.0, 15.0, 0.0);
        glVertex3f(20.0, 20.0, 0.0);
        glVertex3f(15.0, 20.0, 0.0);
    glEnd();
    glfwSwapBuffers(window);
}

int main()
{
    if (!glfwInit())
    {
        fprintf(stderr, "Failed initialize GLFW");
        exit(EXIT_FAILURE);
    }
    GLFWwindow *window = glfwCreateWindow(500, 500, "example", NULL, NULL);
    if (!window)
    {
        fprintf(stderr, "Failed to create GLFW window");
        glfwTerminate();
        exit(EXIT_FAILURE);
    }
    glfwMakeContextCurrent(window);
    glfwSetWindowSizeCallback(window, reshape);

    reshape(window, 500, 500);
    while(!glfwWindowShouldClose(window))
    {
        display(window);
        glfwPollEvents();
    }
    return 0;
}
