// requires vecmath.js

// global variable used to communicate between the settings form and
// the WebGL stuff
let settings = {
    lattice: {
	a: 1, b: 1, c: 1,
	alpha: 90, beta: 90, gamma: 90
    },
    filled: true, // false if wireframe option is selected
    bufs: {},
    controls: {movex: 0, movey: 0}
}

function mousemoved(e) {
    if(e.buttons == 1)
    {
	console.log('displacement: ', e.movementX / 100, ' ', e.movementY / 100)
	settings.controls.movex += e.movementX / 100
	settings.controls.movey += e.movementY / 100
    }
}

function add_settings_callback(gl) {
    // to rotate the BZ
    
    // lattice parameters
    const a = document.querySelector('#bz-form input[type="number"][name="a"]')
    const b = document.querySelector('#bz-form input[type="number"][name="b"]')
    const c = document.querySelector('#bz-form input[type="number"][name="c"]')
    const alpha = document.querySelector('#bz-form input[type="number"][name="alpha"]')
    const beta = document.querySelector('#bz-form input[type="number"][name="beta"]')
    const gamma = document.querySelector('#bz-form input[type="number"][name="gamma"]')
    
    a.addEventListener('change', e => {settings.lattice.a = a.valueAsNumber; recompute_buffers(gl)})
    b.addEventListener('change', e => {settings.lattice.b = b.valueAsNumber; recompute_buffers(gl)})
    c.addEventListener('change', e => {settings.lattice.c = c.valueAsNumber; recompute_buffers(gl)})
    alpha.addEventListener('change', e => {settings.lattice.alpha = alpha.valueAsNumber; recompute_buffers(gl)})
    beta.addEventListener('change', e => {settings.lattice.beta = beta.valueAsNumber; recompute_buffers(gl)})
    gamma.addEventListener('change', e => {settings.lattice.gamma = gamma.valueAsNumber; recompute_buffers(gl)})

    // Standard lattices
    function set_lattice_params(lattice) {
	return e => {
	    Object.assign(settings.lattice, lattice)		
	    
	    a.value = lattice.a
	    b.value = lattice.b
	    c.value = lattice.c
	    alpha.value = lattice.alpha
	    beta.value = lattice.beta
	    gamma.value = lattice.gamma

	    recompute_buffers(gl)
	}
    }
    
    document.querySelector('#bz-form input[type="button"][value="Cubic"]')
	.addEventListener('click', set_lattice_params({a:1,b:1,c:1,alpha:90,beta:90,gamma:90}))
    const is2 = Math.sqrt(2) / 2 // inverse square root of 2
    document.querySelector('#bz-form input[type="button"][value="FCC"]')
	.addEventListener('click', set_lattice_params({a:is2,b:is2,c:is2,alpha:60,beta:60,gamma:60}))
    const s32 = Math.sqrt(3) / 2
    const ac = Math.acos(1 / Math.sqrt(3)) * 180 / Math.PI
    document.querySelector('#bz-form input[type="button"][value="BCC"]')
	.addEventListener('click', set_lattice_params({a:1,b:1,c:s32,alpha:ac,beta:ac,gamma:90}))
        
    // Radio for display
    document.querySelector('#bz-form input[type="radio"][value="filled"]')
	.addEventListener('change', e => {settings.filled = true})
    document.querySelector('#bz-form input[type="radio"][value="wireframe"]')
	.addEventListener('change', e => {settings.filled = false})
    // Reset camera button
    document.querySelector('#bz-form input[type="button"][value="Reset camera"]')
	.addEventListener('click', e => {reset_camera()})
}

function reset_camera() {
    settings.controls = {movex: 0, movey: 0}
}

function main() {
    const canvas = document.querySelector('#bz-canvas')
    const gl = canvas.getContext('webgl')

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }    

    function touch_to_mouse_wrapper(callback) {
	return e => {
	    if(e.touches.length >= 1) {
		callback(e.touches[0])
		e.preventDefault()
	    }
	}
    }

    const touch_move = touch_to_mouse_wrapper(mouse_move)
    let prev_x
    let prev_y
    
    // Mouse move stuff
    function mouse_down(e) {
	// if press mouse start recording
	canvas.addEventListener('mousemove', mouse_move)
	canvas.addEventListener('mouseup', mouse_up)

	canvas.addEventListener('touchmove', touch_move)
	canvas.addEventListener('touchcancel', mouse_up)
	canvas.addEventListener('touchend', mouse_up)

	prev_x = e.clientX
	prev_y = e.clientY
    }

    function mouse_move(e) {
	const dx = e.clientX - prev_x
	const dy = e.clientY - prev_y

	prev_x = e.clientX
	prev_y = e.clientY
	
	settings.controls.movex += dx / 100
	settings.controls.movey += dy / 100
    }

    function mouse_up(e) {
	canvas.removeEventListener('mousemove', mouse_move)
	canvas.removeEventListener('mouseup', mouse_up)

	canvas.removeEventListener('touchmove', touch_move)
	canvas.removeEventListener('touchcancel', mouse_up)
	canvas.removeEventListener('touchend', mouse_up)
    }
    
    canvas.addEventListener('mousedown', mouse_down)
    canvas.addEventListener('touchstart', touch_to_mouse_wrapper(mouse_down))
    
    add_settings_callback(gl)

    // shader for faces of the BZ
    const face_prog = init_shader_prog(gl, `
attribute vec4 pos;
attribute vec3 normal;
attribute vec4 color;

uniform mat4 model;
uniform mat4 proj;

varying lowp vec4 v_color;
varying lowp vec3 v_normal;

void main() {
  gl_Position = proj * model * pos;
  v_color = color;
  v_normal = mat3(model) * normal;
}
`, `
precision lowp float;

varying lowp vec4 v_color;
varying lowp vec3 v_normal;

void main() {
  // gl_FragColor = v_color;
  vec4 c = v_color;
  c.rgb *= (0.75 + 0.25 * max(0.0, normalize(v_normal).z));
  gl_FragColor = c;
}
`)
    const face_prog_info = {
	prog: face_prog,
	attribs: {pos: gl.getAttribLocation(face_prog, 'pos'),
		  normal: gl.getAttribLocation(face_prog, 'normal'),
		  color: gl.getAttribLocation(face_prog, 'color')},
	uniforms: {proj: gl.getUniformLocation(face_prog, 'proj'),
		   model: gl.getUniformLocation(face_prog, 'model')}
    }

    // shader for edges of the BZ
    const edge_prog = init_shader_prog(gl, `
attribute vec4 pos;

uniform mat4 model;
uniform mat4 proj;

void main() {
  gl_Position = proj * model * pos;
}
`, `
void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`)
    const edge_prog_info = {
	prog: edge_prog,
	attribs: {pos: gl.getAttribLocation(edge_prog, 'pos')},
	uniforms: {proj: gl.getUniformLocation(edge_prog, 'proj'),
		   model: gl.getUniformLocation(edge_prog, 'model')}
    }
    
    init_buffers(gl)

    function render(now) {
	draw_scene(gl, face_prog_info, edge_prog_info)
	requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

function init_shader_prog(gl, vs_src, fs_src) {
    const vs = load_shader(gl, gl.VERTEX_SHADER, vs_src)
    const fs = load_shader(gl, gl.FRAGMENT_SHADER, fs_src)

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)

    if (! gl.getProgramParameter(prog, gl.LINK_STATUS)) {
	alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(prog))
	return null
    }

    return prog
}

function load_shader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
	return null;
    }

    return shader;
}

function recompute_buffers(gl) {
    function set_buf(buf, target, arrayfun, usage, data) {
	gl.bindBuffer(target, buf)
	gl.bufferData(target, new arrayfun(data), usage)
	
	return buf
    }

    const {a1, a2, a3} = lattice_vectors_from_constants(settings.lattice)
    let [b1, b2, b3] = reciprocal_lattice(a1, a2, a3)

    // BZ is WS cell with reciprocal lattice vectors instead
    const bz = wigner_seitz_cell(b1, b2, b3)

    let faces = []
    let face_normals = []
    for(let n = 0; n < bz.length; ++n) {
	const face = face_vertices(bz, n)
	if(face.length >= 3) {
	    faces.push(face)
	    face_normals.push(bz[n].slice(0, 3))
	}
    }

    // construct all vertices for all faces
    let points = []
    for(let n=0; n < faces.length; ++n){
	points = points.concat(faces[n])
    }
    set_buf(settings.bufs.pos, gl.ARRAY_BUFFER, Float32Array, gl.STATIC_DRAW,
	    points.reduce((a, b) => a.concat(b)))
    
    let normal = []
    for(let n=0; n < faces.length; ++n) {
	for(let j = 0; j < faces[n].length; ++j) {
	    normal = normal.concat(face_normals[n])
	}
    }
    set_buf(settings.bufs.normal, gl.ARRAY_BUFFER, Float32Array, gl.STATIC_DRAW, normal)
    
    const face_color = [
	0.7,  0.7,  0.7,  1.0
    ]
    let color = []
    for(let j = 0; j < points.length; ++j) {
	color = color.concat(face_color)
    }
    set_buf(settings.bufs.color, gl.ARRAY_BUFFER, Float32Array, gl.STATIC_DRAW, color)

    // indices for faces
    let idx = []
    let idx_offset = 0
    for(let n=0; n<faces.length; ++n) {
	idx = idx.concat(triangulate(faces[n]).map(i => i + idx_offset))
	idx_offset += faces[n].length
    }
    set_buf(settings.bufs.idx, gl.ELEMENT_ARRAY_BUFFER, Uint16Array, gl.STATIC_DRAW,
	    idx)

    // indices for lines
    let idx_line = []
    idx_offset = 0
    for(let n=0; n<faces.length; ++n) {
	idx_line = idx_line.concat(edges_indices(faces[n]).map(i => i + idx_offset))
	idx_offset += faces[n].length
    }
    set_buf(settings.bufs.idx_line, gl.ELEMENT_ARRAY_BUFFER, Uint16Array, gl.STATIC_DRAW,
		idx_line)

    settings.bufs.nidx = idx.length
    settings.bufs.nidx_line = idx_line.length
}

function init_buffers(gl) {
    settings.bufs.pos = gl.createBuffer()
    settings.bufs.normal = gl.createBuffer()
    settings.bufs.color = gl.createBuffer()
    settings.bufs.idx = gl.createBuffer()
    settings.bufs.idx_line = gl.createBuffer()
    
    recompute_buffers(gl)
}

function draw_scene(gl, face_prog_info, edge_prog_info) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // faces
    if(settings.filled) {
	// set pos buffer for attribute pos
	gl.bindBuffer(gl.ARRAY_BUFFER, settings.bufs.pos)
	gl.vertexAttribPointer(face_prog_info.attribs.pos, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(face_prog_info.attribs.pos)

	// set color buffer for attribute color
	gl.bindBuffer(gl.ARRAY_BUFFER, settings.bufs.color)
	gl.vertexAttribPointer(face_prog_info.attribs.color, 4, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(face_prog_info.attribs.color)

	// set normal buffer for attribute normal
	gl.bindBuffer(gl.ARRAY_BUFFER, settings.bufs.normal)
	gl.vertexAttribPointer(face_prog_info.attribs.normal, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(face_prog_info.attribs.normal)

	// bind index buffer for faces
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, settings.bufs.idx)
	
	gl.useProgram(face_prog_info.prog)
	// set uniforms
	gl.uniformMatrix4fv(face_prog_info.uniforms.proj, false,
			    m4_transpose(m4_perspective(45, 640/480, 0.1, 100)))
	gl.uniformMatrix4fv(face_prog_info.uniforms.model, false,
			    m4_transpose(m4_mul(m4_translation([0, 0, -6]),
						m4_rotationx(settings.controls.movey),
						m4_rotationy(settings.controls.movex))))

	// draw the faces
	gl.drawElements(gl.TRIANGLES, settings.bufs.nidx, gl.UNSIGNED_SHORT, 0)
    }
    
    // edges
    
    // set pos buffer for attribute pos
    gl.bindBuffer(gl.ARRAY_BUFFER, settings.bufs.pos)
    gl.vertexAttribPointer(edge_prog_info.attribs.pos, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(edge_prog_info.attribs.pos)

    // bind index buffer for lines
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, settings.bufs.idx_line)

    gl.useProgram(edge_prog_info.prog)

    // set uniforms
    gl.uniformMatrix4fv(edge_prog_info.uniforms.proj, false,
			m4_transpose(m4_perspective(45, 640/480, 0.1, 100)))
    gl.uniformMatrix4fv(edge_prog_info.uniforms.model, false,
			m4_transpose(m4_mul(m4_translation([0, 0, -6]),
						m4_rotationx(settings.controls.movey),
						m4_rotationy(settings.controls.movex))))

    // draw the edges
    gl.drawElements(gl.LINES, settings.bufs.nidx_line, gl.UNSIGNED_SHORT, 0)
}

// Brillouin zone stuff

function argsort(arr) {
    const decor = (v, i) => [v, i]
    const undecor = x => x[1]
    return arr.map(decor).sort((a,b) => a[0]-b[0]).map(undecor)
}

/* take as input a list of N points in 2D or 3D, and returns a list of
 * indices to draw triangles. */
function triangulate(points) {
    if(points.length < 3) { console.error("need at least 3 points to triangulate")
			    return; }

    // project onto the 2D plane if required
    if(points[0].length == 3) points = project_plane(points)
    
    const center = compute_barycenter(points)
    const angles = points.map(p => Math.atan2(...v2_yx(v2_sub(p, center))))
    const indices = argsort(angles)

    // 0th index is the point common to all triangles
    let ret = []
    for(let i = 1; i < indices.length-1; ++i) {
	ret = ret.concat(indices[0], indices[i], indices[i+1])
    }

    return ret
}

/* Take as input a list of N points in 2D or 3D, and returns a list of
 * indices to draw line strips. */
function edges_indices(points) {
    if(points.length < 3) { console.error("need at least 3 points to triangulate")
			    return; }

    // project onto the 2D plane if required
    if(points[0].length == 3) points = project_plane(points)

    const center = compute_barycenter(points)
    const angles = points.map(p => Math.atan2(...v2_yx(v2_sub(p, center))))
    const indices = argsort(angles)

    // use along with gl.LINES
    let ret = []
    for(let i = 0; i < indices.length-1; ++i) {
	ret = ret.concat(indices[i], indices[i+1])
    }
    ret = ret.concat(indices[indices.length-1], indices[0])
    return ret
}

/* Assumes points is a collection of coplanar 3D points, project it
 * onto the plane with arbitrary 2D coordinates */
function project_plane(points) {
    const v = v3_sub(points[0], points[1])
    let w = [0, 0, 0]
    let i = 2
    while(v3_norm(v3_cross(v, w)) < 1e-8) {
	w = v3_sub(points[0], points[i])
	++i
    }
    
    const R = construct_basis_mat(v3_normalize(v3_cross(v, w)))
    const RT = m3_transpose(R)

    const p2 = points.map(p => m3_mulv(RT, v3_sub(p, points[0])))
    if(! p2.every(p => Math.abs(p[2]) <= 1e-8)) console.warn('all points do not belong to the plane', p2)
    return p2.map(p => p.slice(0, 2))
}

function compute_barycenter(points) {
    return v2_divs(points.reduce(v2_add),
		   points.length)
}

function reciprocal_lattice(a1, a2, a3) {
    const det = v3_dot(a1, v3_cross(a2, a3))
    return [
	v3_muls(v3_cross(a2, a3), 1 / det),
	v3_muls(v3_cross(a3, a1), 1 / det),
	v3_muls(v3_cross(a1, a2), 1 / det)
    ]
}

/* Returns an array of 4D arrays, containing the normal and the
 * distance to the origin to represent every plane that enclose the
 * Wigner-Seitz cell */
function wigner_seitz_cell(a1, a2, a3) {
    if(v3_dot(a1, v3_cross(a2, a3)) == 0) {
	console.error('Non independent lattice vectors')
	return;
    }

    const Kcut = 1 // TODO tune this

    let ret = []
    for(let k1 = -Kcut; k1 <= Kcut; ++k1) {
	for(let k2 = -Kcut; k2 <= Kcut; ++k2) {
	    for(let k3 = -Kcut; k3 <= Kcut; ++k3) {
		if (k1 == 0 && k2 == 0 && k3 == 0) continue
		const k = v3_add(v3_muls(a1, k1), v3_add(v3_muls(a2, k2), v3_muls(a3, k3)))
		const norm = v3_norm(k)
		ret.push([...v3_muls(k, 1 / norm), norm / 2])
	    }
	}
    }

    return ret
}

/* Returns a list of 3D coords of the vertices of the nth face of the
 * given Brillouin zone */
function face_vertices(bz, nface) {
    const n = bz.map(x => x.slice(0, 3))
    const d = bz.map(x => x[3])
    const vz = d[nface]
    
    // find a more suitable coordinate system
    const R = construct_basis_mat(n[nface])
    const RT = m3_transpose(R) // transpose==inverse since orthogonal matrix
    const np = n.map(ni => m3_mulv(RT, ni))

    let ps = []
    let rhs = [0.0, 0.0]
    for(let i = 0; i < bz.length; ++i) {
	for(let j = i+1; j < bz.length; ++j) {
	    if(i == nface || j == nface) continue

	    // avoid creating a new array every time
	    rhs[0] = d[i] - vz * np[i][2]
	    rhs[1] = d[j] - vz * np[j][2]
	    // np's are 3D but its faster to not slice them
	    p = solve_system2(np[i], np[j], rhs)
	    // check the solution is valid
	    if(p == undefined) continue
	    // and inside the BZ (change to usual coords first)
	    const realp = m3_mulv(R, [...p, vz])
	    if(! is_inside_half_space(realp, bz[nface]))
		console.error('should be at least part of its own half space')
	    if(! is_inside_bz(realp, bz)) continue

	    // now push it only if it is not too close from previously found vertices
	    let duplicate = false
	    for(let k = 0; k < ps.length; ++k) {
		if(v3_norm(v3_sub(ps[k], realp)) < 1e-8) {
		    duplicate = true
		    break
		}
	    }
	    if(! duplicate) ps.push(realp)
	}
    }

    return ps
}

/* Returns an orthogonal, right-handed 3x3 matrix M such that Mẑ=n */
function construct_basis_mat(n) {
    let a1 = v3_cross(n, [1, 0, 0])
    if(v3_norm(a1) < 1e-8) {
	a1 = v3_cross(n, [0, 1, 0])
    }

    return m3_transpose([...a1, ...v3_cross(n, a1), ...n])
}

/* Solve the 2 equations linear system v.mi = d[0]; v.mj =
 * d[1]. Returns undefined if no solution */
function solve_system2(mi, mj, d) {
    const det = mi[0] * mj[1] - mi[1] * mj[0]
    if(Math.abs(det) <= 1e-8) return

    // perform the division by determinant later for speed
    const inv = [mj[1], -mi[1], -mj[0], mi[0]]
    return v2_divs(m2_mulv(inv, d), det)
}

function is_inside_bz(p, bz) {
    for(let n = 0; n < bz.length; ++n) {
	if(! is_inside_half_space(p, bz[n])) return false
    }

    return true
}

function is_inside_half_space(p, plane) {
    // manually inlined to be faster
    return p[0] * plane[0] + p[1] * plane[1] + p[2] * plane[2] <= plane[3] + 1e-8
    // return v3_dot(p, plane.slice(0, 3)) <= plane[3] + 1e-8
}

function lattice_vectors_from_constants({ a, b, c, alpha, beta, gamma }) {
    // convert to radians
    alpha = alpha * Math.PI / 180
    beta = beta * Math.PI / 180
    gamma = gamma * Math.PI / 180
    
    const a1 = [a, 0, 0]
    const a2 = [b * Math.cos(gamma), b * Math.sin(gamma), 0]
    let a3 = [
	Math.cos(beta),
	(Math.cos(alpha) - Math.cos(gamma) * Math.cos(beta)) / Math.sin(gamma),
	0
    ]
    a3[2] = Math.sqrt(1 - v3_dot(a3, a3))
    a3 = v3_muls(a3, c)

    // make sure it is a right handed basis
    if(v3_dot(a1, v3_cross(a2, a3)) < 0) a3[2] *= -1

    return {a1: a1, a2: a2, a3: a3}
}

main();
