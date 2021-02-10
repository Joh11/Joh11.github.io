import * as React from "react"

import Layout from "../components/layout"

export default function NoteTemplate({ data }) {
    const note = data.orgContent
    const title = note.metadata.title
    return (
	<Layout>
	    <h3>{title}</h3>
	    <div dangerouslySetInnerHTML={{__html: note.html}} />
	</Layout>
    )
}

export const query = graphql`
  query($slug: String!) {
    orgContent(slug: {eq: $slug}) {
      html
      metadata {
        title
      }
    }
  }
`
