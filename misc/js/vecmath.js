// Generated using Parenscript v. 2.7 from vecmath.ps 

function vNorm(v) {
    __PS_MV_REG = [];
    return Math.sqrt(v.map(function (x) {
        return x * x;
    }).reduce(function (x, y) {
        return x + y;
    }));
};
function v2(x, y) {
    return [x, y];
};
function v2star(a, v) {
    return [v[0] * a, v[1] * a];
};
function v2slash(v, a) {
    return [v[0] / a, v[1] / a];
};
function v2plus() {
    var vs = Array.prototype.slice.call(arguments, 0);
    switch (vs.length) {
    case 0:
        __PS_MV_REG = [];
        return v2(0, 0);
    case 1:
        __PS_MV_REG = [];
        return vs[0];
    default:
        var f2544 = function (u, v) {
            return [u[0] + v[0], u[1] + v[1]];
        };
        var acc = vs[0];
        for (var i = 0; i < vs.length - 1; i += 1) {
            acc = f2544(acc, vs[i + 1]);
        };
        var i = null;
        __PS_MV_REG = [];
        return acc;
    };
};
function v2Sub(u, v) {
    return [u[0] - v[0], u[1] - v[1]];
};
function v2Dot(u, v) {
    return u[0] * v[0] + u[1] * v[1];
};
function v3(x, y, z) {
    return [x, y, z];
};
function v3slash(v, a) {
    return [v[0] / a, v[1] / a, v[2] / a];
};
function v3plus() {
    var vs = Array.prototype.slice.call(arguments, 0);
    switch (vs.length) {
    case 0:
        __PS_MV_REG = [];
        return v3(0, 0, 0);
    case 1:
        __PS_MV_REG = [];
        return vs[0];
    default:
        var f2545 = function (u, v) {
            return [u[0] + v[0], u[1] + v[1], u[2] + v[2]];
        };
        var acc = vs[0];
        for (var i = 0; i < vs.length - 1; i += 1) {
            acc = f2545(acc, vs[i + 1]);
        };
        var i = null;
        __PS_MV_REG = [];
        return acc;
    };
};
function v3star(a, v) {
    return [v[0] * a, v[1] * a, v[2] * a];
};
function v3Sub(u, v) {
    return [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
};
function v3Normalize(v) {
    __PS_MV_REG = [];
    return v3slash(v, vNorm(v));
};
function m4Zero() {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
};
function m4Transpose(m) {
    return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
};
function m4Perspective(fovDeg, aspect, near, far) {
    var fovRad = Math.PI * fovDeg * (1 / 180);
    var ret = m4Zero();
    ret[0] = 1 / (aspect * Math.tan(fovRad / 2));
    ret[5] = 1 / Math.tan(fovRad / 2);
    ret[10] = -((far + near) / (far - near));
    ret[11] = (-2 * far * near) / (far - near);
    ret[14] = -1;
    __PS_MV_REG = [];
    return ret;
};
function m4Mul() {
    var factors = Array.prototype.slice.call(arguments, 0);
    switch (factors.length) {
    case 0:
        __PS_MV_REG = [];
        return m4Identity();
    case 1:
        __PS_MV_REG = [];
        return factors[0];
    default:
        var mul2 = function (a, b) {
            var res = m4Zero();
            for (var i = 0; i < 4; i += 1) {
                for (var j = 0; j < 4; j += 1) {
                    for (var k = 0; k < 4; k += 1) {
                        res[4 * i + j] += a[4 * i + k] * b[4 * k + j];
                    };
                };
            };
            var i = null;
            __PS_MV_REG = [];
            return res;
        };
        var acc = factors[0];
        for (var i = 0; i < factors.length - 1; i += 1) {
            acc = mul2(acc, factors[i + 1]);
        };
        var i = null;
        __PS_MV_REG = [];
        return acc;
    };
};
function m4Translation(v) {
    return [1, 0, 0, v[0], 0, 1, 0, v[1], 0, 0, 1, v[2], 0, 0, 0, 1];
};
function m4Rotationx(a) {
    __PS_MV_REG = [];
    return [1, 0, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, 0, Math.sin(a), Math.cos(a), 0, 0, 0, 0, 1];
};
function m4Rotationy(a) {
    __PS_MV_REG = [];
    return [Math.cos(a), 0, Math.sin(a), 0, 0, 1, 0, 0, -Math.sin(a), 0, Math.cos(a), 0, 0, 0, 0, 1];
};
