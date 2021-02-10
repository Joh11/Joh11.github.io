import * as React from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"

export default function NoteTemplate({ data }) {
    const note = data.orgContent
    const title = note.metadata.title
    return (
	<Layout>
	    <Helmet>
		<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
		<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
	    </Helmet>
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
