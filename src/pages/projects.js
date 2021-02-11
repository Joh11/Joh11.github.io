import * as React from "react"

import Layout from "../components/layout"
import data from "../projects/projects.json"

function ProjectList({ projects }) {
    return <ul style={{
		   padding: "0.1em"
	       }}>
	       { projects.map(project => <Project project={project}/>) }
	   </ul>
}

function Tags({ tags }) {
    function Tag({ tag }) {
	return <span style={{
			 margin: "0 0.2em",
			 padding: "0 0.1em",
			 border: "solid #eee 1px",
			 "border-radius": "10%",
			 "font-style": "italic"
		     }}>
		   { tag }
	       </span>
    }
    
    return <div>
	       { tags.map(tag => <Tag tag={ tag }/>) }
	   </div>
}

function Project({ project }) {
    const { url, title, tags, description } = project
    return <li style={{
		   "list-style-type": "none",
		   "border-bottom": "solid #eee 2px"
	       }}>
	       <h4>{ title }{url ? <> [ <a href={ url }> Link</a> ]</> : ""}</h4>
	       <Tags tags={ tags }/>
	       { description ? description.map(p => <p>{ p }</p>) : "" }
	   </li>
}

export default function Projects() {
    return (
	<Layout>
	    <h3>My projects</h3>
	    <ProjectList projects={ data.projects }/>
	</Layout>
    );
}
