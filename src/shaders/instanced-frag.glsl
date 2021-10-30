#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 light = normalize(vec3(0.0, 10.0, 0.0));
    float diffuse = clamp(dot(normalize(fs_Nor.xyz), lightVec), 0.0, 1.0);

    vec4 color = fs_Col * vec4(diffuse * lightColor, 1.0);
    out_Col = color;
}
