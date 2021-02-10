import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../components/layout"

function NoteLink({ to, children }) {
    console.log(to)
    return <li>
	       <Link to={to}>
		   {children}
	       </Link>
	   </li>
}

function AllNotes()
{
    const data = useStaticQuery(graphql`
{
  allOrgContent {
    nodes {
      id
      metadata {
        title
      }
      slug
    }
  }
}
`)
    return <ul>
	       {data.allOrgContent.nodes.map((node, index) =>
		   <NoteLink to={node.slug}>
		       {node.metadata.title}
		   </NoteLink>
	       )}
	   </ul>
}

export default function Notes() {
    return (
	<Layout>
	    <h3>Notes</h3>
	    <p>
		The following notes were primarly used to learn a specific
		topic, using the Feynman technique: learning a subject by
		explaining it to someone else. As I had them lying around in my
		computer, I thought it could be interesting to share them to others. 
	    </p>

	    <p>
		They have been typed in the org-mode format, specifically
		targeting a LateX export. The specific setup file used for the
		export can be found in
		my <a href="https://github.com/Joh11/.emacs.d/blob/master/templates/feynman.org">
		   Emacs dotfiles</a>. 
	    </p>

	    <h4>All notes</h4>
	    <AllNotes/>
	</Layout>
    )
}
