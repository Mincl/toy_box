#ifndef DRAWABLE_HPP
#define DRAWABLE_HPP

#include<vector>
#include<glm/glm.hpp>

using namespace glm;

#define DRAWABLE_HALFFLAG_SPHERE 0
#define DRAWABLE_HALFFLAG_UP 1
#define DRAWABLE_HALFFLAG_DOWN 2

#define DRAWABLE_CIRCLEFLAG_CIRCLE 0
#define DRAWABLE_CIRCLEFLAG_NO 1

class Drawable {
    public:
        int meshCnt;
        int vertexCnt;
        GLenum drawMode;
        GLfloat* vertex;
        GLfloat* color;
        GLfloat* normal;
        vec3 centerPoint;
        
    public:
        Drawable(int meshCnt);
        ~Drawable();
        std::vector<vec3> getCirclePoints(float rad, vec3 center, int cnt, float str, float edr); // center point(x,y,z), radius, vertex count, start radian, end radian
        void setCircle(float rad, float str, float edr);
        void setTulip(float rad);
        void setCylinder(float rad, float height, int heightLevel, int circleFlag); // circleFlag = 0: draw circle, circleFlag = 1: no circle
        void setSphere(float rad, int halfFlag); // halfFlag = 0: draw sphere, halfFlag = 1: draw up sphere, halfFlag = 2: draw down sphere

        void setColor(vec3 c);
        void setNormal();

        void setCenterPoint(vec3 o);
        void translate(vec3 v); // translate vector
        void scale(vec3 factor); // scale by factor
        void rotate(vec3 rad); // rotate by radian
};

#endif