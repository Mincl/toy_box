#ifndef MANAGER_HPP
#define MANAGER_HPP

#include<vector>
#include<utility>

#include<glm/glm.hpp>

#include "drawable.hpp"

using namespace glm;

class Manager {
    private:
        std::vector< std::vector<Drawable*> > drawList;
        std::vector<GLuint> vertexBuffers; // Vector Buffer Object of vertex
        std::vector<GLuint> colorBuffers; // Vector Buffer Object of color
        std::vector<GLuint> normalBuffers;
        int meshCnt;

    public:
        Manager(int meshCnt);
        ~Manager();
        void setBuffer();
        void drawAll();

        void addCircle(float rad, vec3 color, float str, float edr);
        void addTulip(float rad, vec3 color);
        void addCylinder(float rad, float height, int heightLevel, int circleFlag, vec3 color);
        void addSphere(float rad, int halfFlag, vec3 color);
        void addSphereCylinder(float rad, float height, int heightLevel, vec3 color);

        void translateRecent(vec3 v); // translation recent object
        void scaleRecent(vec3 factor); // scale recent object
        void rotateRecent(vec3 rad); // rotate recent object
};

#endif