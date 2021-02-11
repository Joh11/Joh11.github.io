import * as React from "react"

import Layout from "../components/layout"
import data from "../projects/projects.json"

function Project({ project }) {
    const { url, title } = project
    return <li>
	       <a href={ url }>{ title }</a>
	   </li>
}

export default function Projects() {
    return (
	<Layout>
	    <h3>My projects</h3>
	    <ul>
		{ data.projects.map(project => <Project project={project}/>) }
	    </ul>
	</Layout>
    );
}
