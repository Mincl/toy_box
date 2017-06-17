#include<cstdlib>
#include<cmath>
#include<vector>
#include<GL/glew.h>

#include<glm/glm.hpp>
// #include<glm/gtc/matrix_transform.hpp>
using namespace glm;

#include "drawable.hpp"

Drawable::Drawable(int meshCnt) {
    this->meshCnt = meshCnt;
    this->vertexCnt = meshCnt * 3;
    this->drawMode = GL_TRIANGLES;
    this->vertex = NULL;
    this->color = NULL;
    this->normal = NULL;
    this->centerPoint = vec3(0.0f, 0.0f, 0.0f);
}

Drawable::~Drawable() {
}

std::vector<vec3> Drawable::getCirclePoints(float rad, vec3 center, int cnt, float str, float edr) {
    float delta = M_PI * 2.0 / cnt;
    std::vector<vec3> circlePoints;
    for (int i = 0; i <= cnt; i++) {
        if(i * delta >= str && i * delta <= edr) {
            float circlePoint_x = rad * cos(i * delta) + center.x;
            float circlePoint_y = center.y;
            float circlePoint_z = rad * sin(i * delta) + center.z;
            circlePoints.push_back(vec3(circlePoint_x, circlePoint_y, circlePoint_z));
        }
    }
    return circlePoints;
}

void Drawable::setCircle(float rad, float str, float edr) {
    this->drawMode = GL_TRIANGLE_FAN;
    std::vector<vec3> circlePoints = this->getCirclePoints(rad, vec3(0.0f, 0.0f, 0.0f), this->meshCnt, str, edr);

    this->vertexCnt = circlePoints.size() + 1 + 1;
    this->vertex = new vec3[this->vertexCnt];
    this->vertex[0].x = 0.0f; this->vertex[0].y = 0.0f; this->vertex[0].z = 0.0f;
    std::vector<vec3>::iterator it = circlePoints.begin();
    for (int i = 1; it != circlePoints.end(); it++, i++) {
        this->vertex[i] = (*it);
    }
    // degenerate triangle
    this->vertex[this->vertexCnt-1] = vec3(0.0f, 0.0f, 0.0f);
}

void Drawable::setTriangle(vec3 a, vec3 b, vec3 c) {
    this->drawMode = GL_TRIANGLES;
    this->vertexCnt = 3;

    this->vertex = new vec3[this->vertexCnt];
    this->vertex[0] = a;
    this->vertex[1] = b;
    this->vertex[2] = c;
}

void Drawable::setCylinder(float rad, float height, int heightLevel, int circleFlag) {
    this->drawMode = GL_TRIANGLES;
    // top circle, bottom circle, side mesh * 2
    int circleMeshCnt;
    if(circleFlag == DRAWABLE_CIRCLEFLAG_CIRCLE) {
        circleMeshCnt = 2;
    } else {
        circleMeshCnt = 0;
    }
    this->vertexCnt = this->meshCnt * (circleMeshCnt + heightLevel*2) * 3;

    this->vertex = new vec3[this->vertexCnt];
    vec3 originPoint = vec3(0.0f, 0.0f, 0.0f);
    std::vector<vec3> circlePoints = this->getCirclePoints(rad, originPoint, this->meshCnt, 0.0f, M_PI * 2.0f);

    int idx = 0;
    vec3 heightLevelVec = vec3(0.0f, height / heightLevel, 0.0f);
    vec3 heightVec = vec3(0.0f, height, 0.0f);
    vec3 bottomOriginPoint = originPoint - heightVec;
    std::vector<vec3>::iterator it = circlePoints.begin();
    std::vector<vec3>::iterator prevIt = it;
    for(it++; it != circlePoints.end(); it++, prevIt++) {
        if (circleFlag == DRAWABLE_CIRCLEFLAG_CIRCLE) {
            // top circle vertex
            this->vertex[idx] = originPoint; idx++;
            this->vertex[idx] = (*prevIt); idx++;
            this->vertex[idx] = (*it); idx++;

            vec3 bottomVertex = (*it) - heightVec;
            vec3 bottomPrevVertex = (*prevIt) - heightVec;

            // bottom circle vertex
            this->vertex[idx] = bottomOriginPoint; idx++;
            this->vertex[idx] = bottomVertex; idx++;
            this->vertex[idx] = bottomPrevVertex; idx++;
        }

        for(int j = 0; j < heightLevel; j++) {
            vec3 jVec = vec3(j, j, j);
            vec3 jNextVec = vec3(j+1, j+1, j+1);
            vec3 topVertex = (*it) - jVec * heightLevelVec;
            vec3 topPrevVertex = (*prevIt) - jVec * heightLevelVec;
            vec3 bottomVertex = (*it) - jNextVec * heightLevelVec;
            vec3 bottomPrevVertex = (*prevIt) - jNextVec * heightLevelVec;

            // side upper wall vertex
            this->vertex[idx] = topPrevVertex; idx++;
            this->vertex[idx] = bottomVertex; idx++;
            this->vertex[idx] = topVertex; idx++;

            // side lower wall vertex
            this->vertex[idx] = topPrevVertex; idx++;
            this->vertex[idx] = bottomPrevVertex; idx++;
            this->vertex[idx] = bottomVertex; idx++;
        }
    }
    this->translate(heightVec / 2.0f);
    this->setCenterPoint(vec3(0.0f, 0.0f, 0.0f));
}

void Drawable::setSphere(float rad, int halfFlag) {
    this->drawMode = GL_TRIANGLE_STRIP;
    float y_delta = M_PI * 2.0 / this->meshCnt;
    int halfIdx;
    int ySize;
    if (halfFlag == DRAWABLE_HALFFLAG_SPHERE) {
        halfIdx = 0;
        ySize = this->meshCnt / 2;
    } else if (halfFlag == DRAWABLE_HALFFLAG_UP) {
        halfIdx = 0;
        ySize = this->meshCnt / 4 + 1;
    } else if(halfFlag == DRAWABLE_HALFFLAG_DOWN) {
        halfIdx = this->meshCnt / 4;
        ySize = this->meshCnt / 2;
    }

    this->vertexCnt = (this->meshCnt + 1) * (ySize-halfIdx) * 2 + 1;

    this->vertex = new vec3[this->vertexCnt];
    std::vector< std::vector<vec3> > levelPoints;
    for(int i = halfIdx; i <= ySize; i++) {
        float y = rad * cos(i * y_delta);
        std::vector<vec3> circlePoints = this->getCirclePoints(sqrt(rad*rad - y*y), vec3(0.0f, y, 0.0f), this->meshCnt, 0.0f, M_PI * 2.0f);
        levelPoints.push_back(circlePoints);
    }

    int j = 0;
    std::vector< std::vector<vec3> >::iterator prev_it, it;
    prev_it = levelPoints.begin();
    it = prev_it + 1;
    for(; it != levelPoints.end(); prev_it++, it++) {
        std::vector<vec3>::iterator prev_point_it, point_it;
        for(prev_point_it = (*prev_it).begin(), point_it = (*it).begin();
            point_it != (*it).end();
            prev_point_it++, point_it++) {
                this->vertex[j] = (*prev_point_it); j++;
                this->vertex[j] = (*point_it); j++;
        }
    }
    // degenerate triangle
    this->vertex[j] = this->vertex[j-1];
}

void Drawable::setColor(vec3 c) {
    this->color = new vec3[this->vertexCnt];
    for (int i = 0; i < this->vertexCnt; i++) {
        this->color[i] = c;
    }
}

void Drawable::setNormal() {
    this->normal = new vec3[this->vertexCnt];

    vec3 p1, p2, p3;
    vec3 u, v, normal;
    if(this->drawMode == GL_TRIANGLES) {
        for (int i = 0; i < this->vertexCnt; i+=3) {
            p1 = this->vertex[i];
            p2 = this->vertex[i+1];
            p3 = this->vertex[i+2];
            u = p1 - p3;
            v = p1 - p2;
            normal = normalize(cross(u, v));

            this->normal[i] = normal;
            this->normal[i+1] = normal;
            this->normal[i+2] = normal;
        }

    } else if(this->drawMode == GL_TRIANGLE_FAN) {
        p1 = this->vertex[0];
        p2 = this->vertex[1];
        p3 = this->vertex[2];
        u = p1 - p3;
        v = p1 - p2;
        normal = normalize(cross(u, v));
        this->normal[0] = normal;
        for (int i = 1; i+2 < this->vertexCnt; i++) {
            p2 = this->vertex[i];
            p3 = this->vertex[i+1];
            u = p1 - p3;
            v = p1 - p2;
            normal = normalize(cross(u, v));

            this->normal[i] = normal;
            this->normal[i+1] = normal;
        }

    } else if(this->drawMode == GL_TRIANGLE_STRIP) {
        for (int i = 0; i+2 < this->vertexCnt; i++) {
            p1 = this->vertex[i];
            p2 = this->vertex[i+1];
            p3 = this->vertex[i+2];
            u = p1 - p3;
            v = p1 - p2;
            if (i % 2 == 1) {
                u = p1 - p2;
                v = p1 - p3;
            }
            normal = normalize(cross(u, v));

            // if can't make face, skip calculate normal vector
            if (p1 == p2 || p2 == p3 || p1 == p3)
                continue;

            // printf("(%.3f, %.3f, %.3f / %.3f, %.3f, %.3f / %.3f, %.3f, %.3f) - [%.3f, %.3f, %.3f]\n", \
            //     p1.x, p1.y, p1.z, \
            //     p2.x, p2.y, p2.z, \
            //     p3.x, p3.y, p3.z, \
            //     normal.x, normal.y, normal.z);

            this->normal[i] = normal;
            this->normal[i+1] = normal;
            this->normal[i+2] = normal;
        }
    }
}

void Drawable::setCenterPoint(vec3 o) {
    this->centerPoint = o;
}

void Drawable::translate(vec3 v) {
    for (int i = 0; i < this->vertexCnt; i++) {
        this->vertex[i] = this->vertex[i] + v;
    }
    this->centerPoint = this->centerPoint + v;
}

void Drawable::scale(vec3 factor) {
    for (int i = 0; i < this->vertexCnt; i++) {
        this->vertex[i] = this->centerPoint + (this->vertex[i] - this->centerPoint) * factor;
    }
}

void Drawable::rotate(vec3 rad) {
    mat3 rx = mat3(1.0f, 0.0f, 0.0f,
                    0.0f, cos(rad.x), -1*sin(rad.x),
                    0.0f, sin(rad.x), cos(rad.x));
    mat3 ry = mat3(cos(rad.y), 0.0f, sin(rad.y),
                    0.0f, 1.0f, 0.0f,
                    -1*sin(rad.y), 0.0f, cos(rad.y));
    mat3 rz = mat3(cos(rad.z), -1*sin(rad.z), 0.0f,
                    sin(rad.z), cos(rad.z), 0.0f,
                    0.0f, 0.0f, 1.0f);

    mat3 r = rz * ry * rx;
    for (int i = 0; i < this->vertexCnt; i++) {
        this->vertex[i] = this->centerPoint + r * this->vertex[i];
    }
}