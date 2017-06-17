#ifndef LIGHT_HPP
#define LIGHT_HPP

struct Light {
    vec3 position;
    vec3 intensities;
    float ambientCoefficient;
    float attenuationFactor;
};

#endif