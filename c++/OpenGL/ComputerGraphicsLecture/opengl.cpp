#include<cstdio>
#include<cstdlib>

#include<GL/glew.h>
#include<GLFW/glfw3.h>
GLFWwindow* window;

#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
using namespace glm;

#include"lib/shader.hpp"
#include"lib/controls.hpp"
#include"lib/drawable.hpp"
#include"lib/manager.hpp"
#include"lib/light.hpp"

Light gLight;

int main() {
    if (!glfwInit()) {
        fprintf(stderr, "Failed to initialize GLFW\n");
        return -1;
    }

    glfwWindowHint(GLFW_SAMPLES, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    window = glfwCreateWindow(1024, 768, "test", NULL, NULL);
    if(window == NULL) {
        fprintf(stderr, "Failed to open GLFW window. If you have an Intel GPU, they are not 3.3 compatible.\n");
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);

    glewExperimental = true;
    if (glewInit() != GLEW_OK) {
        fprintf(stderr, "Failed to initialize GLEW\n");
        glfwTerminate();
        return -1;
    }

    glfwSetInputMode(window, GLFW_STICKY_KEYS, GL_TRUE);
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

    glfwPollEvents();
    glfwSetCursorPos(window, 1024/2, 768/2);

    // set background color
    glClearColor(0.0f, 0.0f, 0.4f, 0.0f);

    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    glEnable(GL_DEPTH_TEST);
    glDepthFunc(GL_LESS);

    // not use Cull Face mode
    // glEnable(GL_CULL_FACE);

    GLuint VertexArrayID;
    glGenVertexArrays(1, &VertexArrayID);
    glBindVertexArray(VertexArrayID);

    GLuint programID = LoadShaders("shaders/TransformVertexShader.vertexshader", "shaders/ColorFragmentShader.fragmentshader");

    GLuint modelID = glGetUniformLocation(programID, "model");
    GLuint viewID = glGetUniformLocation(programID, "view");
    GLuint projectionID = glGetUniformLocation(programID, "projection");
    GLuint lightPositionID = glGetUniformLocation(programID, "light.position");
    GLuint lightIntensitiesID = glGetUniformLocation(programID, "light.intensities");

    gLight.position = vec3(2.0f, 1.0f, 5.0f);
    gLight.intensities = vec3(1.5f, 1.5f, 1.5f);

    int meshCnt = 30;
    Manager* manager = new Manager(meshCnt);
    
    float rad = 1.0f;
    int heightLevel = 10;
    vec3 ryanColor = vec3(1.0f, 187.0f/255.0f, 0.0f); // #ffbb00
    vec3 whiteColor = vec3(1.0f, 1.0f, 1.0f); // #ffffff
    vec3 blackColor = vec3(0.0f, 0.0f, 0.0f); // #000000
    
    // ryan body
    manager->addSphereCylinder(rad, 4.0f, heightLevel, ryanColor);
    manager->scaleRecent(vec3(1.0f, 0.3f, 0.7f));

    // ryan head
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, ryanColor);
    manager->scaleRecent(vec3(1.5f, 1.5f, 1.5f));
    manager->translateRecent(vec3(0.0f, 1.7f, 0.0f));

    // ryan left ear
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, ryanColor);
    manager->scaleRecent(vec3(0.3f, 0.3f, 0.1f));
    manager->translateRecent(vec3(-0.9f, 2.8f, 0.0f));

    // ryan right ear
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, ryanColor);
    manager->scaleRecent(vec3(0.3f, 0.3f, 0.1f));
    manager->translateRecent(vec3(0.9f, 2.8f, 0.0f));

    // ryan tail
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, ryanColor);
    manager->scaleRecent(vec3(0.3f, 0.3f, 0.3f));
    manager->translateRecent(vec3(0.0f, -0.6f, -0.7f));

    // ryan left leg
    manager->addSphereCylinder(rad, 2.0f, heightLevel, ryanColor);
    manager->scaleRecent(vec3(0.5f, 0.5f, 0.5f));
    manager->translateRecent(vec3(-0.5f, -1.0f, 0.0f));

    // ryan right leg
    manager->addSphereCylinder(rad, 2.0f, heightLevel, ryanColor);
    manager->scaleRecent(vec3(0.5f, 0.5f, 0.5f));
    manager->translateRecent(vec3(0.5f, -1.0f, 0.0f));

    // ryan left arm
    manager->addSphereCylinder(rad, 2.0f, heightLevel, ryanColor);
    manager->rotateRecent(vec3(0.0f, 0.0f, 45.0f));
    manager->scaleRecent(vec3(0.4f, 0.4f, 0.4f));
    manager->translateRecent(vec3(-1.2f, 0.0f, 0.0f));

    // ryan right arm
    manager->addSphereCylinder(rad, 2.0f, heightLevel, ryanColor);
    manager->rotateRecent(vec3(0.0f, 0.0f, -45.0f));
    manager->scaleRecent(vec3(0.4f, 0.4f, 0.4f));
    manager->translateRecent(vec3(1.2f, 0.0f, 0.0f));

    // ryan left nose
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, whiteColor);
    manager->scaleRecent(vec3(0.2f, 0.2f, 0.2f));
    manager->translateRecent(vec3(-0.17f, 1.5f, 1.4f));

    // ryan right nose
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, whiteColor);
    manager->scaleRecent(vec3(0.2f, 0.2f, 0.2f));
    manager->translateRecent(vec3(0.17f, 1.5f, 1.4f));

    // ryan middle nose
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, blackColor);
    manager->scaleRecent(vec3(0.1f, 0.1f, 0.1f));
    manager->translateRecent(vec3(0.0f, 1.625f, 1.5f));

    // ryan left eye
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, blackColor);
    manager->scaleRecent(vec3(0.08f, 0.08f, 0.04f));
    manager->rotateRecent(vec3(0.0f, M_PI * 2.0f / 16.0f, 0.f));
    manager->translateRecent(vec3(-0.6f, 2.0f, 1.35f));

    // ryan right eye
    manager->addSphere(rad, DRAWABLE_HALFFLAG_SPHERE, blackColor);
    manager->scaleRecent(vec3(0.08f, 0.08f, 0.04f));
    manager->rotateRecent(vec3(0.0f, -M_PI * 2.0f / 16.0f, 0.f));
    manager->translateRecent(vec3(0.6f, 2.0f, 1.35f));

    // ryan left eyebrow
    manager->addSphereCylinder(rad, 4.0f, heightLevel, blackColor);
    manager->rotateRecent(vec3(0.0f, 0.0f, M_PI * 2.0f / 4.0f));
    manager->scaleRecent(vec3(0.08f, 0.04f, 0.04f));
    manager->rotateRecent(vec3(0.0f, M_PI * 2.0f / 16.0f, 0.f));
    manager->translateRecent(vec3(-0.6f, 2.2f, 1.3f));

    // ryan right eyebrow
    manager->addSphereCylinder(rad, 4.0f, heightLevel, blackColor);
    manager->rotateRecent(vec3(0.0f, 0.0f, M_PI * 2.0f / 4.0f));
    manager->scaleRecent(vec3(0.08f, 0.04f, 0.04f));
    manager->rotateRecent(vec3(0.0f, -M_PI * 2.0f / 16.0f, 0.f));
    manager->translateRecent(vec3(0.6f, 2.2f, 1.3f));

    // generate buffer, and set buffer data
    manager->setBuffer();

    do {
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        // use our shader
        glUseProgram(programID);

        // compute the MVP matrix
        computeMatricesFromInputs();
        glm::mat4 ProjectionMatrix = getProjectionMatrix();
        glm::mat4 ViewMatrix = getViewMatrix();
        glm::mat4 ModelMatrix = glm::mat4(1.0);

        glUniformMatrix4fv(modelID, 1, GL_FALSE, &ModelMatrix[0][0]);
        glUniformMatrix4fv(viewID, 1, GL_FALSE, &ViewMatrix[0][0]);
        glUniformMatrix4fv(projectionID, 1, GL_FALSE, &ProjectionMatrix[0][0]);
        glUniform3f(lightPositionID, gLight.position.x, gLight.position.y, gLight.position.z);
        glUniform3f(lightIntensitiesID, gLight.intensities.x, gLight.intensities.y, gLight.intensities.z);

        // bind our texture in Texture Unit 0
        // glActiveTexture(GL_TEXTURE0);
        // glBindTexture(GL_TEXTURE_2D, Texture);
        // glUniform1i(TextureID, 0);

        // enable vertex attribute array and set attribute pointer to vertex
        // and draw the triangle, next disable vertex attribute arrays
        manager->drawAll();

        // UVs
        // glEnableVertexAttribArray(1);
        // glBindBuffer(GL_ARRAY_BUFFER, uvbuffer);
        // glVertexAttribPointer(
        //     1,
        //     2,
        //     GL_FLOAT,
        //     GL_FALSE,
        //     0,
        //     (void*)0
        // );


        // Swap buffers
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    while( glfwGetKey(window, GLFW_KEY_ESCAPE ) != GLFW_PRESS &&
        glfwWindowShouldClose(window) == 0);

    // glDeleteBuffers(1, &uvbuffer);
    glDeleteProgram(programID);
    // glDeleteTextures(1, &TextureID);
    glDeleteVertexArrays(1, &VertexArrayID);

    // Close OpenGL window and terminate GLFW
    glfwTerminate();

    return 0;
}