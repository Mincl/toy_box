#include<cstdlib>
#include<cmath>
#include<vector>
#include<utility>
#include<GL/glew.h>

#include "drawable.hpp"
#include "manager.hpp"

Manager::Manager(int meshCnt) {
    this->meshCnt = meshCnt;
}

Manager::~Manager() {
    std::vector<GLuint>::iterator it = this->vertexBuffers.begin();
    for(; it != this->vertexBuffers.end(); it++) {
        glDeleteBuffers(1, &(*it));
    }

    for(it = this->colorBuffers.begin(); it != this->colorBuffers.end(); it++) {
        glDeleteBuffers(1, &(*it));
    }
}

void Manager::setBuffer() {
    std::vector< std::vector<Drawable*> >::iterator it = this->drawList.begin();
    for (; it != this->drawList.end(); it++) {
        std::vector<Drawable*>::iterator dit = (*it).begin();
        for (; dit != (*it).end(); dit++) {
            GLuint vertexbuffer;
            glGenBuffers(1, &vertexbuffer);
            glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
            glBufferData(GL_ARRAY_BUFFER, (*dit)->vertexCnt * 3 * sizeof(GLfloat), (*dit)->vertex, GL_STATIC_DRAW);
            this->vertexBuffers.push_back(vertexbuffer);

            GLuint colorbuffer;
            glGenBuffers(1, &colorbuffer);
            glBindBuffer(GL_ARRAY_BUFFER, colorbuffer);
            glBufferData(GL_ARRAY_BUFFER, (*dit)->vertexCnt * 3 * sizeof(GLfloat), (*dit)->color, GL_STATIC_DRAW);
            this->colorBuffers.push_back(colorbuffer);

            GLuint normalbuffer;
            glGenBuffers(1, &normalbuffer);
            glBindBuffer(GL_ARRAY_BUFFER, normalbuffer);
            glBufferData(GL_ARRAY_BUFFER, (*dit)->vertexCnt * 3 * sizeof(GLfloat), (*dit)->normal, GL_STATIC_DRAW);
            this->normalBuffers.push_back(normalbuffer);
        }
    }
}

void Manager::drawAll() {
    std::vector< std::vector<Drawable*> >::iterator drawIt = this->drawList.begin();
    std::vector<GLuint>::iterator vertexBufferIt = this->vertexBuffers.begin();
    std::vector<GLuint>::iterator colorBufferIt = this->colorBuffers.begin();
    std::vector<GLuint>::iterator normalBufferIt = this->normalBuffers.begin();

    for(int i = 0; drawIt != this->drawList.end(); drawIt++) {
        std::vector<Drawable*>::iterator dIt = (*drawIt).begin();
        for(; dIt != (*drawIt).end(); dIt++, vertexBufferIt++, colorBufferIt++, normalBufferIt++, i+=2) {
            // enable vertex array
            glEnableVertexAttribArray(0);
            glBindBuffer(GL_ARRAY_BUFFER, *vertexBufferIt);
            glVertexAttribPointer(
                0,
                3,
                GL_FLOAT,
                GL_FALSE,
                0,
                (void *)0);

            glEnableVertexAttribArray(1);
            glBindBuffer(GL_ARRAY_BUFFER, *colorBufferIt);
            glVertexAttribPointer(
                1,
                3,
                GL_FLOAT,
                GL_FALSE,
                0,
                (void *)0);

            glEnableVertexAttribArray(2);
            glBindBuffer(GL_ARRAY_BUFFER, *normalBufferIt);
            glVertexAttribPointer(
                2,
                3,
                GL_FLOAT,
                GL_FALSE,
                0,
                (void *)0);

            // draw
            glDrawArrays((*dIt)->drawMode, 0, (*dIt)->vertexCnt * 3);

            // disable vertex array
            glDisableVertexAttribArray(0);
            glDisableVertexAttribArray(1);
            glDisableVertexAttribArray(2);
        }
    }
}

void Manager::addCircle(float rad, vec3 color) {
    Drawable* circle = new Drawable(this->meshCnt);
    circle->setCircle(rad);
    circle->setColor(color);
    circle->setNormal();

    std::vector<Drawable*> group;
    group.push_back(circle);
    this->drawList.push_back(group);
}

void Manager::addCylinder(float rad, float height, int heightLevel, int circleFlag, vec3 color) {
    Drawable* cylinder = new Drawable(this->meshCnt);
    cylinder->setCylinder(rad, height, heightLevel, circleFlag);
    cylinder->setColor(color);
    cylinder->setNormal();

    std::vector<Drawable*> group;
    group.push_back(cylinder);
    this->drawList.push_back(group);
}

void Manager::addSphere(float rad, int halfFlag, vec3 color) {
    Drawable* sphere = new Drawable(this->meshCnt);
    sphere->setSphere(rad, halfFlag);
    sphere->setColor(color);
    sphere->setNormal();

    std::vector<Drawable*> group;
    group.push_back(sphere);
    this->drawList.push_back(group);
}

void Manager::addSphereCylinder(float rad, float height, int heightLevel, vec3 color) {
    float halfHeight = height / 2.0f;

    Drawable* topSphere = new Drawable(this->meshCnt);
    topSphere->setSphere(rad, DRAWABLE_HALFFLAG_UP);
    topSphere->setColor(color);
    topSphere->translate(vec3(0.0f, halfHeight, 0.0f));
    topSphere->setCenterPoint(vec3(0.0f, 0.0f, 0.0f));
    topSphere->setNormal();

    Drawable* bodyCylinder = new Drawable(this->meshCnt);
    bodyCylinder->setCylinder(rad, height, heightLevel, DRAWABLE_CIRCLEFLAG_NO);
    bodyCylinder->setColor(color);
    bodyCylinder->setNormal();

    Drawable* bottomSphere = new Drawable(this->meshCnt);
    bottomSphere->setSphere(rad, DRAWABLE_HALFFLAG_DOWN);
    bottomSphere->setColor(color);
    bottomSphere->translate(vec3(0.0f, halfHeight-height, 0.0f));
    bottomSphere->setCenterPoint(vec3(0.0f, 0.0f, 0.0f));
    bottomSphere->setNormal();

    std::vector<Drawable*> group;
    group.push_back(topSphere);
    group.push_back(bodyCylinder);
    group.push_back(bottomSphere);
    this->drawList.push_back(group);
}

void Manager::translateRecent(vec3 v) {
    std::vector< std::vector<Drawable*> >::iterator it = this->drawList.begin();
    for(; it != this->drawList.end(); it++) {
        if(it+1 == this->drawList.end()) {
            for(std::vector<Drawable*>::iterator dit = (*it).begin(); dit != (*it).end(); dit++) {
                (*dit)->translate(v);
            }
        }
    }
}

void Manager::scaleRecent(vec3 factor) {
    std::vector< std::vector<Drawable*> >::iterator it = this->drawList.begin();
    for(; it != this->drawList.end(); it++) {
        if(it+1 == this->drawList.end()) {
            for(std::vector<Drawable*>::iterator dit = (*it).begin(); dit != (*it).end(); dit++) {
                (*dit)->scale(factor);
            }
        }
    }
}

void Manager::rotateRecent(vec3 rad) {
    std::vector< std::vector<Drawable*> >::iterator it = this->drawList.begin();
    for(; it != this->drawList.end(); it++) {
        if(it+1 == this->drawList.end()) {
            for(std::vector<Drawable*>::iterator dit = (*it).begin(); dit != (*it).end(); dit++) {
                (*dit)->rotate(rad);
            }
        }
    }
}