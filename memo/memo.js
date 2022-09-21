window.MathJax = {
    tex: {
	macros: {
	    dd: '{\\rm d}',
	    vec: ['{\\bf #1}', 1],
	},
    }
}


function disable_button() {
    button.value = 'Loading ...'
    button.disabled = true
}

function enable_button(text) {
    button.value = text
    button.disabled = false
}

function is_headline(line) {
    return line.match(/^\* /)
}

function process_headline(line) {
    return line.substr(2)
	.replace('<<<', '').replace('>>>', '')
}

function parse_org(text) {
    let lines = text.split('\n')
    let entries = []
    
    for(let i = 0 ; i < lines.length ; ++i) {
	if(is_headline(lines[i])) {
	    let title = process_headline(lines[i])
	    let body = []
	    for(let j = i + 1 ; j < lines.length ; ++j) {
		if(is_headline(lines[j])) break
		body.push(lines[j])
	    }

	    entries.push({title: title, body: body.join('\n')})
	}
    }

    return entries
}

function random_item(coll) {
    let idx = Math.floor(Math.random() * coll.length)
    return coll[idx]
}

function new_question() {
    current_entry = random_item(entries)
    content.textContent = current_entry.title
    MathJax.typeset()

    enable_button('Show answer')
    button.removeEventListener('click', new_question)
    button.addEventListener('click', show_answer)
}

function show_answer() {
    content.textContent = current_entry.body
    MathJax.typeset()

    enable_button('New question')
    button.removeEventListener('click', show_answer)
    button.addEventListener('click', new_question)
}

const button = document.querySelector('#continue-button')
const content = document.querySelector('#content')

// put in 'loading' state
disable_button()

// first read the org file
const org_url = './dict'
let entries = []
let orgtext = ''
let current_entry

fetch(org_url)
    .then(response => response.text())
    .then(text => {
	orgtext = text
	enable_button('New question')
	entries = parse_org(text)
    })

button.addEventListener('click', new_question)
