#ifndef CONTROLS_HPP
#define CONTROLS_HPP

#include<GLFW/glfw3.h>

void mouse_button_callback(GLFWwindow* window, int button, int action, int mods);
void computeMatricesFromInputs();
glm::mat4 getViewMatrix();
glm::mat4 getProjectionMatrix();
glm::vec3 getCameraPos();

#endif