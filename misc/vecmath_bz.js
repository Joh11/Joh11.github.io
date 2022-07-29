// Old version of vecmath, used only by bz.js, hence the name

// Matrix manipulation stuff

// order: dimension, and vector then matrix

function v2_add(a, b) {
    return [a[0] + b[0],
	    a[1] + b[1]]
}

function v2_sub(a, b) {
    return [a[0] - b[0],
	    a[1] - b[1]]
}

function v2_divs(v, s)
{
    return [v[0] / s, v[1] / s]
}

function m2_muls(m, s) {
    return m.map(x => x*s)
}

function m2_mulv(m, v) {
    return [m[0]*v[0] + m[1]*v[1],
	    m[2]*v[0] + m[3]*v[1]]
}

function v2_yx(v) {
    return [v[1], v[0]]
}

function v3_dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function v3_cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
	    a[2] * b[0] - a[0] * b[2],
	    a[0] * b[1] - a[1] * b[0]]
}

function v3_add(a, b) {
    return [a[0] + b[0],
	    a[1] + b[1],
	    a[2] + b[2]]
}

function v3_sub(a, b) {
    return [a[0] - b[0],
	    a[1] - b[1],
	    a[2] - b[2]]
}

function v3_muls(a, s) {
    return a.map(x => x * s)
}

function v3_norm(a) {
    return Math.sqrt(v3_dot(a, a))
}

function v3_normalize(a) {
    return v3_muls(a, 1 / v3_norm(a))
}

function m3_mulv(m, v) {
    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
	    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
	    m[6] * v[0] + m[7] * v[1] + m[8] * v[2]]
}

function m3_transpose(m) {
    return [m[0], m[3], m[6],
	    m[1], m[4], m[7],
	    m[2], m[5], m[8]]
}

function m4_identity() {
    return [1, 0, 0, 0,
	    0, 1, 0, 0,
	    0, 0, 1, 0,
	    0, 0, 0, 1]
}

function m4_zero() {
    return [0, 0, 0, 0,
	    0, 0, 0, 0,
	    0, 0, 0, 0,
	    0, 0, 0, 0]
}

function m4_mul2(a, b) {
    let res = []
    res[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12]
    res[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13]
    res[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14]
    res[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15]

    res[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12]
    res[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13]
    res[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14]
    res[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15]

    res[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12]
    res[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13]
    res[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14]
    res[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15]

    res[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12]
    res[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13]
    res[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14]
    res[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]

    return res
}

function m4_mul(...ms) {
    if(ms.length == 0) return m4_identity()
    if(ms.length == 1) return ms[0]
    let acc = ms[0]
    // could reduce the number of calls but it's fine
    for(let i = 1; i < ms.length; ++i) {
	acc = m4_mul2(acc, ms[i])
    }
    return acc
}

function m4_translation(t)
{
    return [1, 0, 0, t[0],
	    0, 1, 0, t[1],
	    0, 0, 1, t[2],
	    0, 0, 0, 1,]
}

function m4_scale(s) {
    return [s, 0, 0, 0,
	    0, s, 0, 0,
	    0, 0, s, 0,
	    0, 0, 0, 1,]
}

function m4_perspective(fov_deg, aspect, near, far) {
    const fov_rad = Math.PI * fov_deg / 180
    let ret = m4_zero()
    ret[0] = 1 / (aspect * Math.tan(fov_rad / 2)) // 1,1
    ret[5] = 1 / Math.tan(fov_rad / 2)            // 2,2
    ret[10] = -(far + near) / (far - near)        // 3,3
    ret[11] = -2 * far * near / (far - near)      // 3,4
    ret[14] = -1                                  // 4,3

    return ret
}

function m4_transpose(m) {
    return [m[0], m[4], m[8], m[12],
	    m[1], m[5], m[9], m[13],
	    m[2], m[6], m[10], m[14],
	    m[3], m[7], m[11], m[15]]
}

function m4_rotationx(a) {
    return [1, 0,           0,            0,
	    0, Math.cos(a), -Math.sin(a), 0,
	    0, Math.sin(a), Math.cos(a),  0,
	    0, 0,           0,            1]
}

function m4_rotationy(a) {
    return [Math.cos(a),  0, Math.sin(a), 0,
	    0,            1, 0,           0,
	    -Math.sin(a), 0, Math.cos(a), 0,
	    0,            0, 0,           1]
}
