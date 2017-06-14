// Include GLFW
#include<cstdio>
#include<cmath>
#include <GLFW/glfw3.h>

// Include GLM
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
using namespace glm;

#include "controls.hpp"
#include "light.hpp"

extern GLFWwindow *window; // The "extern" keyword here is to access the variable "window" declared in tutorialXXX.cpp. This is a hack to keep the tutorials simple. Please avoid this.
extern Light gLight;

bool lineMode = false;
glm::mat4 ViewMatrix;
glm::mat4 ProjectionMatrix;

glm::mat4 getViewMatrix()
{
    return ViewMatrix;
}
glm::mat4 getProjectionMatrix()
{
    return ProjectionMatrix;
}

float horizontalAngle = 0.0f;
float verticalAngle = 0.0f;
float initialFoV = 45.0f;
float cameraDis = 10.0f;

float speed = 3.0f; // 3 units / second
float mouseSpeed = 0.005f;
bool pressFlag = false;

void computeMatricesFromInputs()
{

    // glfwGetTime is called only once, the first time this function is called
    static double lastTime = glfwGetTime();

    // Compute time difference between current and last frame
    double currentTime = glfwGetTime();
    float deltaTime = float(currentTime - lastTime);

    // Get mouse position
    double xpos, ypos;
    glfwGetCursorPos(window, &xpos, &ypos);

    // Reset mouse position for next frame
    glfwSetCursorPos(window, 1024 / 2, 768 / 2);

    // Compute new orientation
    horizontalAngle += mouseSpeed * float(1024 / 2 - xpos);
    verticalAngle += mouseSpeed * float(768 / 2 - ypos);

    // Direction : Spherical coordinates to Cartesian coordinates conversion
    glm::vec3 direction(
        cos(verticalAngle) * sin(horizontalAngle),
        sin(verticalAngle),
        cos(verticalAngle) * cos(horizontalAngle));
    mat3 i = mat3();
    direction = cameraDis * i * direction;

    // Right vector
    glm::vec3 right = glm::vec3(
        sin(horizontalAngle - 3.14f / 2.0f),
        0,
        cos(horizontalAngle - 3.14f / 2.0f));

    // Up vector
    glm::vec3 up = glm::cross(right, direction);

    // Move forward
    if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS ||
        glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS ||
        glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
    {
        cameraDis -= deltaTime * speed * 1.5f;
    }
    // Move backward
    if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS ||
        glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS ||
        glfwGetKey(window, GLFW_KEY_Z) == GLFW_PRESS)
    {
        cameraDis += deltaTime * speed * 1.5f;
    }
    // button 'l'
    if (glfwGetKey(window, GLFW_KEY_L) == GLFW_PRESS && pressFlag == false) {
        if(lineMode == false) {
            // show polygon by line
            glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
            lineMode = true;
        } else {
            // show polygon by line
            glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
            lineMode = false;
        }
        pressFlag = true;
    }
    if (glfwGetKey(window, GLFW_KEY_L) == GLFW_RELEASE && pressFlag == true) {
        pressFlag = false;
    }

    float FoV = initialFoV; // - 5 * glfwGetMouseWheel(); // Now GLFW 3 requires setting up a callback for this. It's a bit too complicated for this beginner's tutorial, so it's disabled instead.

    // Projection matrix : 45∞ Field of View, 4:3 ratio, display range : 0.1 unit <-> 100 units
    ProjectionMatrix = glm::perspective(FoV, 4.0f / 3.0f, 0.1f, 100.0f);
    // Camera matrix
    ViewMatrix = glm::lookAt(
        direction,             // Camera is here
        vec3(0.0f, 0.0f, 0.0f), // look to zero point
        up                    // Head is up (set to 0,-1,0 to look upside-down)
        );
    gLight.position = direction;

    // For the next frame, the "last time" will be "now"
    lastTime = currentTime;
}