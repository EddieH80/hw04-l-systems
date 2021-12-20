#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{
    vec3 lightPos = normalize(vec3(0.0, 10.0, 0.0));
    float lambert = clamp(dot(normalize(fs_Nor.xyz), lightPos), 0.0, 1.0);

    vec4 color = fs_Col * lambert;
    out_Col = color;
}
