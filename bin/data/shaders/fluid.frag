uniform sampler2D tex;
uniform sampler2D map;
uniform vec2 resolution;
uniform float timer;

float rand(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amplitude;
		n += n;
		amplitude *= 0.5;
	}
	return total;
}

void main (void) {
    const vec3 c1 = vec3(0.1, 0.0, 0.0);
	const vec3 c2 = vec3(0.7, 0.0, 0.0);
	const vec3 c3 = vec3(0.2, 0.0, 0.0);
	const vec3 c4 = vec3(1.0, 0.9, 0.0);
	const vec3 c5 = vec3(0.5);
	const vec3 c6 = vec3(0.9);

	vec2 p = gl_TexCoord[0].st*25.5;
	float q = fbm(p - timer * 0.1);
	vec2 r = vec2(fbm(p + q + timer * 0.7 - p.x - p.y), fbm(p + q - timer * 0.4));
	vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);

	vec4 alpha_color = texture2D(tex, gl_TexCoord[0].xy);
	if(alpha_color.r<.1)
		discard;
	else
        gl_FragColor = vec4(c * cos(5.57 * gl_TexCoord[0].s / resolution.y), .756);
}
