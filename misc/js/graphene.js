// Generated using Parenscript v. 2.7 from graphene.ps 

function clearScreen(gl, r, g, b) {
    if (r === undefined) {
        r = 0;
    };
    if (g === undefined) {
        g = 0;
    };
    if (b === undefined) {
        b = 0;
    };
    gl.clearColor(r, g, b, 1);
    return gl.clear(gl.COLOR_BUFFER_BIT | gl.COLOR_DEPTH_BIT);
};
function mapcar(fun, arr) {
    return arr.map(fun);
};
function flat(arr) {
    return arr.flat();
};
function concat(arr1, arr2) {
    return arr1.concat(arr2);
};
function clamp(val, min, max) {
    if (val > max) {
        console.warn('val greater than max');
    };
    if (val < min) {
        console.warn('val lesser than min');
    };
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    };
};
function caret2(x) {
    return x * x;
};
/** Returns an array, containing N *different* empty arrays.  */
function arrayOfArrays(n) {
    __PS_MV_REG = [];
    return Array(n).fill(0).map(function (x) {
        return [];
    });
};
function bindBufferReplaceType(gl, type) {
    if (typeof type === 'string') {
        if (type === 'array-buffer') {
            return gl.ARRAY_BUFFER;
        } else if (type === 'element-array-buffer') {
            return gl.ELEMENT_ARRAY_BUFFER;
        } else {
            return console.error('bind-buffer: invalid type', type);
        };
    } else {
        return type;
    };
};
function bindBuffer(gl, type, buf) {
    __PS_MV_REG = [];
    return gl.bindBuffer(bindBufferReplaceType(gl, type), buf);
};
var vsSrc3d = '\nattribute vec3 pos;\n\nuniform mat4 model;\nuniform mat4 proj;\n\nvoid main() {\n  gl_Position = proj * model * vec4(pos, 1.0);\n}\n';
var vsSrc3dNormal = '\nattribute vec3 pos;\nattribute vec3 normal;\n\nuniform mat4 model;\nuniform mat4 proj;\n\nvarying lowp vec3 v_normal;\n\nvoid main() {\n  v_normal = mat3(model) * normal;\n  gl_Position = proj * model * vec4(pos, 1.0);\n}\n';
var vsSrc3dNormalColor = '\nattribute vec3 pos;\nattribute vec3 normal;\nattribute vec3 color;\n\nuniform mat4 model;\nuniform mat4 proj;\n\nvarying lowp vec3 v_normal;\nvarying lowp vec3 v_color;\n\nvoid main() {\n  v_normal = mat3(model) * normal;\n  v_color = color;\n  gl_Position = proj * model * vec4(pos, 1.0);\n}\n';
var fsSrcNormalVaryingColor = '\nprecision lowp float;\n\nvarying lowp vec3 v_normal;\nvarying lowp vec3 v_color;\n\nvoid main() {\n  vec4 c = vec4(v_color.x, v_color.y, v_color.z, 1);\n  c.rgb *= (0.75 + 0.25 * max(0.0, normalize(v_normal).z));\n  gl_FragColor = c;\n}\n';
function shaderSrcNormalConstantColor(r, g, b, a) {
    if (a === undefined) {
        a = 1;
    };
    return '\nprecision lowp float;\n\nvarying lowp vec3 v_normal;\n\nvoid main() {\n  vec4 c = vec4(' + r + ', ' + g + ', ' + b + ', ' + a + ');\n  c.rgb *= (0.75 + 0.25 * max(0.0, normalize(v_normal).z));\n  gl_FragColor = c;\n}\n';
};
function shaderSrcConstantColor(r, g, b, a) {
    if (a === undefined) {
        a = 1;
    };
    return 'void main() {\n  gl_FragColor = vec4(' + r + ', ' + g + ', ' + b + ', ' + a + ');\n}';
};
function initShaderProgram(gl, vsSrc, fsSrc) {
    var vs = loadShader(gl, 'vertex-shader', vsSrc);
    var fs = loadShader(gl, 'fragment-shader', fsSrc);
    var shader = gl.createProgram();
    gl.attachShader(shader, vs);
    gl.attachShader(shader, fs);
    gl.linkProgram(shader);
    if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
        alert('unable to init shader program: ' + gl.getProgramInfoLog(shader));
        __PS_MV_REG = [];
        return null;
    };
    __PS_MV_REG = [];
    return shader;
};
function loadShaderReplaceType(gl, type) {
    if (typeof type === 'string') {
        if (type === 'vertex-shader') {
            return gl.VERTEX_SHADER;
        } else if (type === 'fragment-shader') {
            return gl.FRAGMENT_SHADER;
        } else {
            return console.error('wrong type in load-shader: ', type);
        };
    } else {
        return type;
    };
};
function loadShader(gl, type, src) {
    type = loadShaderReplaceType(gl, type);
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('error compiling shader: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        __PS_MV_REG = [];
        return null;
    };
    __PS_MV_REG = [];
    return shader;
};
function makeArrayBuffer(gl, components) {
    var buf = gl.createBuffer();
    bindBuffer(gl, 'array-buffer', buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(components), gl.STATIC_DRAW);
    __PS_MV_REG = [];
    return buf;
};
function makeElementArrayBuffer(gl, components) {
    var buf = gl.createBuffer();
    bindBuffer(gl, 'element-array-buffer', buf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(components), gl.STATIC_DRAW);
    __PS_MV_REG = [];
    return buf;
};
/**
 * Compute the number of vertices or elements. It is the length of the
 *   EBO, or the number of points if not defined
 */
function computeNvertOrElem(gl, posBuf, ebo) {
    bindBuffer(gl, 'array-buffer', posBuf);
    if (ebo) {
        bindBuffer(gl, 'element-array-buffer', ebo);
    };
    __PS_MV_REG = [];
    return ebo ? gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE) / 2 : gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) / (3 * 4);
};
function xor(a, b) {
    return (a || b) && !(a && b);
};
/** By default, MODE is gl.TRIANGLE_STRIP.  */
function makeRenderObj(gl, program, posBuf) {
    var _js2517 = arguments.length;
    for (var n2516 = 3; n2516 < _js2517; n2516 += 2) {
        switch (arguments[n2516]) {
        case 'mode':
            mode = arguments[n2516 + 1];
            break;
        case 'ebo':
            ebo = arguments[n2516 + 1];
            break;
        case 'normal':
            normal = arguments[n2516 + 1];
            break;
        case 'color':
            color = arguments[n2516 + 1];
        };
    };
    var mode;
    var ebo;
    var normal;
    var color;
    if (!mode) {
        mode = gl.TRIANGLE_STRIP;
    };
    bindBuffer(gl, 'array-buffer', posBuf);
    var obj = { program : program,
                position : posBuf,
                nvertOrElem : computeNvertOrElem(gl, posBuf, ebo),
                attributes : { pos : gl.getAttribLocation(program, 'pos') },
                uniforms : { proj : gl.getUniformLocation(program, 'proj'), model : gl.getUniformLocation(program, 'model') },
                mode : mode,
                ebo : ebo,
                normal : normal,
                color : color
              };
    if (normal) {
        obj.attributes.normal = gl.getAttribLocation(program, 'normal');
    };
    if (color) {
        obj.attributes.color = gl.getAttribLocation(program, 'color');
    };
    __PS_MV_REG = [];
    return obj;
};
function registerRenderObj(renderObjects, obj) {
    renderObjects.push(obj);
    return obj;
};
function registerRenderObjList(renderObjects, objs) {
    for (var obj = null, _js_idx2518 = 0; _js_idx2518 < objs.length; _js_idx2518 += 1) {
        obj = objs[_js_idx2518];
        renderObjects.push(obj);
    };
    var obj = null;
    return objs;
};
function clearRenderObjs(renderObjects) {
    return renderObjects.length = 0;
};
function render(renderObjects, settings, gl) {
    return renderObjects.map(function (obj) {
        __PS_MV_REG = [];
        return renderOne(settings, gl, obj);
    });
};
/** For now not very flexible, will be modified if needed */
function enableVertexAttrib(gl, location, buf, size) {
    if (size === undefined) {
        size = 3;
    };
    bindBuffer(gl, 'array-buffer', buf);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    __PS_MV_REG = [];
    return gl.enableVertexAttribArray(location);
};
/**
 * Load proper 4x4 matrices into the uniforms MODEL and PROJ, given
 * the move vector in CONTROLS. 
 */
function loadCameraUniforms(gl, uniforms, settings) {
    gl.uniformMatrix4fv(uniforms.proj, false, m4Transpose(m4Perspective(45, 640 / 480, 0.1, 100)));
    __PS_MV_REG = [];
    return gl.uniformMatrix4fv(uniforms.model, false, m4Transpose(m4Mul(m4Translation(v3star(-1, settings.cameraPos)), m4Rotationx(settings.controls.movey), m4Rotationy(settings.controls.movex))));
};
function renderOne(settings, gl, obj) {
    var pos = gl.getAttribLocation(obj.program, 'pos');
    var nvertOrElem2519 = obj.nvertOrElem;
    var ebo2520 = obj.ebo;
    var mode2521 = obj.mode;
    var normal2522 = obj.normal;
    var color2523 = obj.color;
    bindBuffer(gl, 'array-buffer', obj.position);
    if (ebo2520) {
        bindBuffer(gl, 'element-array-buffer', ebo2520);
    };
    enableVertexAttrib(gl, obj.attributes.pos, obj.position);
    if (normal2522) {
        enableVertexAttrib(gl, obj.attributes.normal, normal2522);
    };
    if (color2523) {
        enableVertexAttrib(gl, obj.attributes.color, color2523);
    };
    gl.useProgram(obj.program);
    loadCameraUniforms(gl, obj.uniforms, settings);
    __PS_MV_REG = [];
    return ebo2520 ? gl.drawElements(mode2521, nvertOrElem2519, gl.UNSIGNED_SHORT, 0) : gl.drawArrays(mode2521, 0, nvertOrElem2519);
};
/**
 * Update controls.move[xy] when the mouse is moving on the canvas,
 *   with a button pressed. 
 */
function injectMouseEventHandling(canvas, controls) {
    var prevX = null;
    var prevY = null;
    var mouseMove = function (e) {
        var dx = e.clientX - prevX;
        var dy = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        controls.movex += dx / 100;
        return controls.movey += dy / 100;
    };
    var mouseDown = function (e) {
        canvas.addEventListener('mousemove', mouseMove);
        canvas.addEventListener('mouseup', mouseUp);
        prevX = e.clientX;
        return prevY = e.clientY;
    };
    var mouseUp = function (e) {
        canvas.removeEventListener('mousemove', mouseMove);
        return canvas.removeEventListener('mouseup', mouseUp);
    };
    return canvas.addEventListener('mousedown', mouseDown);
};
function selectElement(selector) {
    var element = document.querySelector(selector);
    if (!element) {
        console.error('element not found: ', selector);
    };
    return element;
};
function buttonAddOnClick(fun, selector) {
    __PS_MV_REG = [];
    return selectElement(selector).addEventListener('click', fun);
};
function resetCamera(settings) {
    settings.controls.movex = 0;
    return settings.controls.movey = 0;
};
function valenceBandDisplayString(settings) {
    return settings.valenceBand ? 'Hide valence band' : 'Display valence band';
};
function toggleValenceBandDisplay(renderObjects, settings, registerFun, button) {
    settings.valenceBand = !settings.valenceBand;
    button.value = valenceBandDisplayString(settings);
    clearRenderObjs(renderObjects);
    __PS_MV_REG = [];
    return registerFun();
};
var π = Math.PI;
function reciprocalLattice2d(a1, a2) {
    var det = a1[0] * a2[1] - a1[1] * a2[0];
    var val2524 = v2star(2 * π * (1 / det), v2(a2[1], -a2[0]));
    __PS_MV_REG = [v2star(2 * π * (1 / det), v2(a1[1], -a1[0]))];
    return val2524;
};
function makeBzHexagon(gl, shift) {
    if (shift === undefined) {
        shift = v3(0, 0, 0);
    };
    var g = grapheneVectors();
    var coords = [g.k, v2plus(g.kstar, g.b1), v2plus(g.k, v2star(-1, g.b2)), g.kstar, v2plus(g.k, v2star(-1, g.b1)), v2plus(g.kstar, g.b2)];
    coords = coords.map(function (v2) {
        __PS_MV_REG = [];
        return v3(v2[0], 0, v2[1]);
    });
    coords = coords.map(function (v3) {
        __PS_MV_REG = [];
        return v3plus(v3, shift);
    });
    __PS_MV_REG = [];
    return makeRenderObj(gl, initShaderProgram(gl, vsSrc3d, shaderSrcConstantColor(1, 0, 0)), makeArrayBuffer(gl, flat(coords)), 'mode', gl.LINE_LOOP);
};
/** Returns a rgb vector.  */
function colorMap(val, min, max) {
    val = (clamp(val, min, max) - min) / (max - min);
    __PS_MV_REG = [];
    return val > 0.5 ? v3(0, 2 * (val - 0.5), 2 * (1 - val)) : v3(0, 2 * (0.5 - val), 2 * val);
};
/** Helper function for MAKE-TRIANGLE-HEIGHTMAP */
function heightMapMakeColorBuf(gl, heights, colorMap) {
    __PS_MV_REG = [];
    return makeArrayBuffer(gl, flat(mapcar(colorMap, heights)));
};
/**
 * Helper function for MAKE-TRIANGLE-HEIGHTMAP. Difference between
 * ORIGIN and SHIFT: SHIFT does not change the value of the heightmap. 
 */
function heightMapMakeVertBufs(gl, n, a1, a2, heightFun, yScale, origin, shift) {
    var points = [];
    var normals = [];
    var heights = [];
    var pointsIdcs = arrayOfArrays(n + 1);
    var nacc = -1;
    for (var n1 = 0; n1 < n + 1; n1 += 1) {
        for (var n2 = 0; n2 < n - n1 - -1; n2 += 1) {
            var pos = v3plus(origin, v3star(n1, a1), v3star(n2, a2));
            __PS_MV_REG = [];
            var height = heightFun(pos[0], pos[2]);
            var grad = __PS_MV_REG[0];
            height = yScale * height;
            grad = v2star(yScale, grad);
            pos[1] += height;
            points[++nacc] = v3plus(shift, pos);
            normals[nacc] = v3Normalize(v3(-grad[0], 1, -grad[1]));
            heights[nacc] = height / yScale;
            pointsIdcs[n1][n2] = nacc;
        };
    };
    var val2525 = makeArrayBuffer(gl, flat(points));
    __PS_MV_REG = [makeArrayBuffer(gl, flat(normals)), heights, pointsIdcs];
    return val2525;
};
/** Helper function for MAKE-TRIANGLE-HEIGHTMAP */
function heightMapMakeIdcs(gl, n, pointsIdcs) {
    var idcs = [];
    var nacc = -1;
    for (var n2 = 0; n2 < n; n2 += 1) {
        for (var n1 = 0; n1 < n - n2 - 1; n1 += 1) {
            idcs[++nacc] = pointsIdcs[n1][n2];
            idcs[++nacc] = pointsIdcs[n1 + 1][n2];
            idcs[++nacc] = pointsIdcs[n1][n2 + 1];
            idcs[++nacc] = pointsIdcs[n1][n2 + 1];
            idcs[++nacc] = pointsIdcs[n1 + 1][n2];
            idcs[++nacc] = pointsIdcs[n1 + 1][n2 + 1];
        };
        idcs[++nacc] = pointsIdcs[n - n2][n2];
        idcs[++nacc] = pointsIdcs[n - n2 - 1][n2 + 1];
        idcs[++nacc] = pointsIdcs[n - n2 - 1][n2];
    };
    __PS_MV_REG = [];
    return makeElementArrayBuffer(gl, idcs);
};
/**
 * Construct a heightmap, dividing the triangle in NITER
 *   iterations. 
 */
function makeTriangleHeightmap(gl, triangleVertices, niter, heightFun, colorMap) {
    var _js2527 = arguments.length;
    for (var n2526 = 5; n2526 < _js2527; n2526 += 2) {
        switch (arguments[n2526]) {
        case 'y-scale':
            yScale = arguments[n2526 + 1];
            break;
        case 'origin':
            origin = arguments[n2526 + 1];
        };
    };
    var yScale = 'undefined' === typeof yScale ? 1 : yScale;
    var origin = 'undefined' === typeof origin ? v3(0, 0, 0) : origin;
    var n = Math.pow(2, niter);
    var a1red = v3slash(v3Sub(triangleVertices[1], triangleVertices[0]), n);
    var a2red = v3slash(v3Sub(triangleVertices[2], triangleVertices[0]), n);
    var maxHeight = null;
    __PS_MV_REG = [];
    var pointsBuf = heightMapMakeVertBufs(gl, n, a1red, a2red, heightFun, yScale, triangleVertices[0], origin);
    var normalsBuf = __PS_MV_REG[0];
    var heights = __PS_MV_REG[1];
    var pointsIdcs = __PS_MV_REG[2];
    __PS_MV_REG = [];
    return makeRenderObj(gl, initShaderProgram(gl, vsSrc3dNormalColor, fsSrcNormalVaryingColor), pointsBuf, 'ebo', heightMapMakeIdcs(gl, n, pointsIdcs), 'mode', gl.TRIANGLES, 'normal', normalsBuf, 'color', heightMapMakeColorBuf(gl, heights, colorMap));
};
/** Compute relevant vectors of the graphene BZ */
function grapheneVectors() {
    var a1 = v2slash(v2(3, Math.sqrt(3)), 2);
    var a2 = v2slash(v2(3, -Math.sqrt(3)), 2);
    __PS_MV_REG = [];
    var b1 = reciprocalLattice2d(a1, a2);
    var b2 = __PS_MV_REG[0];
    var k = v2slash(v2plus(b1, b2), 3);
    var kstar = v2slash(v2plus(b1, b2), -3);
    var deltas = [v2(1, 0), v2Sub(v2(1, 0), a1), v2Sub(v2(1, 0), a2)];
    var delta2s = [a1, v2Sub(a2, a1), v2star(-1, a2)];
    __PS_MV_REG = [];
    return { a1 : a1,
             a2 : a2,
             b1 : b1,
             b2 : b2,
             k : k,
             kstar : kstar,
             deltas : deltas,
             delta2s : delta2s
           };
};
var GRAPHENE = grapheneVectors();
/** all the 6 triangles that constitute the BZ */
function makeTrianglesBz() {
    var k2528 = GRAPHENE.k;
    var kstar2529 = GRAPHENE.kstar;
    var b1_2530 = GRAPHENE.b1;
    var b2_2531 = GRAPHENE.b2;
    var c0 = v2(0, 0);
    __PS_MV_REG = [];
    return [[k2528, v2plus(kstar2529, b1_2530), c0], [v2plus(kstar2529, b1_2530), v2Sub(k2528, b2_2531), c0], [v2Sub(k2528, b2_2531), kstar2529, c0], [kstar2529, v2Sub(k2528, b1_2530), c0], [v2Sub(k2528, b1_2530), v2plus(kstar2529, b2_2531), c0], [v2plus(kstar2529, b2_2531), k2528, c0]];
};
/** all the 10 triangles that are around K and K*+b1 */
function makeTrianglesK() {
    var k2532 = GRAPHENE.k;
    var kstar2533 = GRAPHENE.kstar;
    var b1_2534 = GRAPHENE.b1;
    var b2_2535 = GRAPHENE.b2;
    var c0 = v2(0, 0);
    var b1B2 = v2Sub(b1_2534, b2_2535);
    __PS_MV_REG = [];
    return [[b2_2535, k2532, v2plus(kstar2533, b2_2535)], [b2_2535, v2plus(kstar2533, b1_2534, b2_2535), k2532], [b1_2534, k2532, v2plus(kstar2533, b1_2534, b2_2535)], [b1_2534, v2plus(kstar2533, b1_2534), k2532], [b1_2534, v2plus(k2532, b1_2534, v2star(-1, b2_2535)), v2plus(kstar2533, b1_2534)], [b1B2, v2plus(kstar2533, b1_2534), v2plus(k2532, b1_2534, v2star(-1, b2_2535))], [b1B2, v2Sub(k2532, b2_2535), v2plus(kstar2533, b1_2534)], [c0, v2plus(kstar2533, b1_2534), v2Sub(k2532, b2_2535)], [c0, k2532, v2plus(kstar2533, b1_2534)], [c0, v2plus(kstar2533, b2_2535), k2532]];
};
/** converts a 2d vector (x z) to a 3d vector (x 0 z) */
function addYequals0Coord(v2) {
    __PS_MV_REG = [];
    return v3(v2[0], 0, v2[1]);
};
/** returns a list of render objects, one for each triangle of the BZ */
function makeBandStructure(gl, niter, triangles) {
    var _js2537 = arguments.length;
    for (var n2536 = 3; n2536 < _js2537; n2536 += 2) {
        switch (arguments[n2536]) {
        case 'valence-band':
            valenceBand = arguments[n2536 + 1];
            break;
        case 'y-scale':
            yScale = arguments[n2536 + 1];
            break;
        case 'origin':
            origin = arguments[n2536 + 1];
        };
    };
    var valenceBand;
    var yScale = 'undefined' === typeof yScale ? 1 : yScale;
    var origin = 'undefined' === typeof origin ? v3(0, 0, 0) : origin;
    var maxHeight = grapheneConductionBand(0, 0);
    var mapAddYequals0 = function (coords) {
        return coords.map(addYequals0Coord);
    };
    var colorMapPartialApplied = function (h) {
        __PS_MV_REG = [];
        return colorMap(h, -maxHeight, maxHeight);
    };
    __PS_MV_REG = [];
    return valenceBand ? concat(mapcar(function (coords) {
        __PS_MV_REG = [];
        return makeTriangleHeightmap(gl, mapAddYequals0(coords), niter, grapheneConductionBand, colorMapPartialApplied, 'yscale', yScale, 'origin', origin);
    }, triangles), mapcar(function (coords) {
        __PS_MV_REG = [];
        return makeTriangleHeightmap(gl, mapAddYequals0(coords), niter, grapheneValenceBand, colorMapPartialApplied, 'yscale', yScale, 'origin', origin);
    }, triangles)) : mapcar(function (coords) {
        __PS_MV_REG = [];
        return makeTriangleHeightmap(gl, mapAddYequals0(coords), niter, grapheneConductionBand, colorMapPartialApplied, 'yscale', yScale, 'origin', origin);
    }, triangles);
};
function grapheneD1(k) {
    var val2538 = GRAPHENE.deltas.map(function (delta) {
        __PS_MV_REG = [];
        return Math.cos(v2Dot(k, delta));
    }).reduce(function (x, y) {
        return x + y;
    });
    __PS_MV_REG = [v2star(-1, GRAPHENE.deltas.map(function (delta) {
        __PS_MV_REG = [];
        return v2star(Math.sin(v2Dot(k, delta)), delta);
    }).reduce(function (u, v) {
        __PS_MV_REG = [];
        return v2plus(u, v);
    }))];
    return val2538;
};
function grapheneD2(k) {
    var val2539 = GRAPHENE.deltas.map(function (delta) {
        __PS_MV_REG = [];
        return Math.sin(v2Dot(k, delta));
    }).reduce(function (x, y) {
        return x + y;
    });
    __PS_MV_REG = [GRAPHENE.deltas.map(function (delta) {
        __PS_MV_REG = [];
        return v2star(Math.cos(v2Dot(k, delta)), delta);
    }).reduce(function (u, v) {
        __PS_MV_REG = [];
        return v2plus(u, v);
    })];
    return val2539;
};
function grapheneD3(k) {
    return SETTINGSCOMMON.m + SETTINGSCOMMON.haldaneT * GRAPHENE.delta2s.map(function (delta2) {
        __PS_MV_REG = [];
        return Math.sin(v2Dot(k, delta2));
    }).reduce(function (x, y) {
        return x + y;
    });
};
function conductionBandWithoutD3(kx, ky) {
    var k = v2(kx, ky);
    __PS_MV_REG = [];
    var d1 = grapheneD1(k);
    var dd1 = __PS_MV_REG[0];
    __PS_MV_REG = [];
    var d2 = grapheneD2(k);
    var dd2 = __PS_MV_REG[0];
    var it = Math.sqrt(caret2(d1) + caret2(d2));
    var val2540 = it;
    __PS_MV_REG = [Math.sqrt(caret2(d1) + caret2(d2)), v2star(2 / it, v2plus(v2star(d1, dd1), v2star(d2, dd2)))];
    return val2540;
};
function grapheneConductionBand(kx, ky) {
    __PS_MV_REG = [];
    var d3 = grapheneD3(v2(kx, ky));
    var dd3 = __PS_MV_REG[0];
    __PS_MV_REG = [];
    var d = conductionBandWithoutD3(kx, ky);
    var dd = __PS_MV_REG[0];
    var val2541 = d3 + d;
    __PS_MV_REG = [dd3 + dd];
    return val2541;
};
function grapheneValenceBand(kx, ky) {
    __PS_MV_REG = [];
    var d3 = grapheneD3(v2(kx, ky));
    var dd3 = __PS_MV_REG[0];
    __PS_MV_REG = [];
    var d = conductionBandWithoutD3(kx, ky);
    var dd = __PS_MV_REG[0];
    var val2542 = d3 - d;
    __PS_MV_REG = [dd3 - dd];
    return val2542;
};
var SETTINGSCOMMON = { m : 0, haldaneT : 0 };
var RENDERBZ = [];
var SETTINGSBZ = { controls : { movex : 0, movey : 0 },
                   valenceBand : true,
                   cameraPos : v3(0, 0, 8)
                 };
function registerAllBz(renderObjects, settings, gl) {
    registerRenderObj(renderObjects, makeBzHexagon(gl));
    __PS_MV_REG = [];
    return registerRenderObjList(renderObjects, makeBandStructure(gl, 4, makeTrianglesBz(), 'valence-band', settings.valenceBand, 'y-scale', 1));
};
function mainBz() {
    var canvas = document.querySelector('#bz-canvas');
    var gl = canvas.getContext('webgl', { alpha : false });
    if (gl === null) {
        alert('unable to initialize WebGL !');
    };
    injectMouseEventHandling(canvas, SETTINGSBZ.controls);
    buttonAddOnClick(function () {
        __PS_MV_REG = [];
        return resetCamera(SETTINGSBZ);
    }, '#display-form input[type=\"button\"][value=\"Reset camera\"]');
    buttonAddOnClick(function (e) {
        __PS_MV_REG = [];
        return toggleValenceBandDisplay(RENDERBZ, SETTINGSBZ, function () {
            __PS_MV_REG = [];
            return registerAllBz(RENDERBZ, SETTINGSBZ, gl);
        }, e.target);
    }, '#display-form #valence-band');
    SETTINGSBZ.gl = gl;
    gl.enable(gl.DEPTH_TEST);
    registerAllBz(RENDERBZ, SETTINGSBZ, gl);
    var renderFun = function (now) {
        clearScreen(gl, 1, 1, 1);
        render(RENDERBZ, SETTINGSBZ, gl);
        __PS_MV_REG = [];
        return requestAnimationFrame(renderFun);
    };
    __PS_MV_REG = [];
    return requestAnimationFrame(renderFun);
};
var RENDERK = [];
var SETTINGSK = { controls : { movex : 0, movey : 0 },
                  valenceBand : true,
                  cameraPos : v3(0, 0, 10)
                };
/** computes the coords of the middle point between K and K* */
function kPlotOrigin() {
    __PS_MV_REG = [];
    return addYequals0Coord(v3star(0.5, v3plus(GRAPHENE.k, GRAPHENE.kstar, GRAPHENE.b1)));
};
function registerAllK(renderObjects, settings, gl) {
    registerRenderObj(renderObjects, makeBzHexagon(gl, v3star(-1, kPlotOrigin())));
    __PS_MV_REG = [];
    return registerRenderObjList(renderObjects, makeBandStructure(gl, 4, makeTrianglesK(), 'valence-band', settings.valenceBand, 'y-scale', 1, 'origin', v3star(-1, kPlotOrigin())));
};
function mainK() {
    var canvas = document.querySelector('#k-canvas');
    var gl = canvas.getContext('webgl', { alpha : false });
    if (gl === null) {
        alert('unable to initialize WebGL !');
    };
    injectMouseEventHandling(canvas, SETTINGSK.controls);
    buttonAddOnClick(function () {
        __PS_MV_REG = [];
        return resetCamera(SETTINGSK);
    }, '#display-form input[type=\"button\"][value=\"Reset camera\"]');
    buttonAddOnClick(function (e) {
        __PS_MV_REG = [];
        return toggleValenceBandDisplay(RENDERK, SETTINGSK, function () {
            __PS_MV_REG = [];
            return registerAllK(RENDERK, SETTINGSK, gl);
        }, e.target);
    }, '#display-form #valence-band');
    SETTINGSK.gl = gl;
    gl.enable(gl.DEPTH_TEST);
    registerAllK(RENDERK, SETTINGSK, gl);
    var renderFun = function (now) {
        clearScreen(gl, 1, 1, 1);
        render(RENDERK, SETTINGSK, gl);
        __PS_MV_REG = [];
        return requestAnimationFrame(renderFun);
    };
    __PS_MV_REG = [];
    return requestAnimationFrame(renderFun);
};
function regenerateEverything() {
    clearRenderObjs(RENDERBZ);
    registerAllBz(RENDERBZ, SETTINGSBZ, SETTINGSBZ.gl);
    clearRenderObjs(RENDERK);
    __PS_MV_REG = [];
    return registerAllK(RENDERK, SETTINGSK, SETTINGSK.gl);
};
function hamiltonianFormula(massTermwhat, haldaneTermwhat) {
    var _cmp2543;
    var terms = [];
    if (massTermwhat) {
        terms.push('M');
    };
    if (haldaneTermwhat) {
        terms.push('2t_H \\sum_{\\delta\'} \\sin(\\vec k \\cdot \\delta\')');
    };
    if (_cmp2543 = terms.length, 0 === _cmp2543 && _cmp2543 === terms.push('0')) {
    };
    return '\\[\n      \\begin{align}\n      &amp; d_1(\\vec k) = \\sum_{\\vec \\delta} \\cos(\\vec k \\cdot \\vec \\delta) \\\\\n      &amp; d_2(\\vec k) = \\sum_{\\vec \\delta} \\sin(\\vec k \\cdot \\vec \\delta) \\\\\n      &amp; d_3(\\vec k) = ' + terms.join(' + ') + ' \\\\\n      \\end{align}\n      \\]';
};
function massTermRangeLabel(value) {
    return '\\(M = ' + value + ' \\)';
};
function renderLatex() {
    return MathJax.typeset();
};
function updateHamiltonianFormula() {
    var massBox = selectElement('#hamiltonian-control #mass-term');
    var haldaneBox = selectElement('#hamiltonian-control #haldane-term');
    var formula = selectElement('#hamiltonian-formula');
    formula.innerHTML = hamiltonianFormula(massBox.checked, haldaneBox.checked);
    __PS_MV_REG = [];
    return renderLatex();
};
function setupMassTerm() {
    var box = selectElement('#hamiltonian-control #mass-term');
    var range = selectElement('#hamiltonian-control #mass-term-range');
    var rangeLabel = selectElement('#hamiltonian-control #mass-term-range-label');
    var formula = selectElement('#hamiltonian-formula');
    var onBoxChange = function () {
        if (box.checked) {
            range.hidden = false;
            rangeLabel.hidden = false;
        } else {
            range.hidden = true;
            rangeLabel.hidden = true;
            range.value = '0';
            onRangeChange();
        };
        __PS_MV_REG = [];
        return updateHamiltonianFormula();
    };
    var onRangeChange = function () {
        rangeLabel.innerHTML = massTermRangeLabel(range.value);
        renderLatex();
        SETTINGSCOMMON.m = range.valueAsNumber;
        __PS_MV_REG = [];
        return regenerateEverything();
    };
    onBoxChange();
    onRangeChange();
    box.addEventListener('change', onBoxChange);
    __PS_MV_REG = [];
    return range.addEventListener('input', onRangeChange);
};
function haldaneTermRangeLabel(value) {
    return '\\(t_H = ' + value + ' \\)';
};
function setupHaldaneTerm() {
    var box = selectElement('#hamiltonian-control #haldane-term');
    var range = selectElement('#hamiltonian-control #haldane-term-range');
    var rangeLabel = selectElement('#hamiltonian-control #haldane-term-range-label');
    var formula = selectElement('#hamiltonian-formula');
    var onBoxChange = function () {
        if (box.checked) {
            range.hidden = false;
            rangeLabel.hidden = false;
        } else {
            range.hidden = true;
            rangeLabel.hidden = true;
            range.value = '0';
            onRangeChange();
        };
        __PS_MV_REG = [];
        return updateHamiltonianFormula();
    };
    var onRangeChange = function () {
        rangeLabel.innerHTML = haldaneTermRangeLabel(range.value);
        renderLatex();
        SETTINGSCOMMON.haldaneT = range.valueAsNumber;
        __PS_MV_REG = [];
        return regenerateEverything();
    };
    onBoxChange();
    onRangeChange();
    box.addEventListener('change', onBoxChange);
    __PS_MV_REG = [];
    return range.addEventListener('input', onRangeChange);
};
function hamiltonianControlMain() {
    setupMassTerm();
    __PS_MV_REG = [];
    return setupHaldaneTerm();
};
window.onload = function () {
    mainBz();
    mainK();
    __PS_MV_REG = [];
    return hamiltonianControlMain();
};
