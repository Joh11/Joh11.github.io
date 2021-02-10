import * as React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import "../styles/notes.css"

function EnableLatex() {
    const latexHeader = `
\\(
\\renewcommand{\\dd}{\\mathrm{d}}
\\renewcommand{\\diff}[2]{\\frac{\\dd #1}{\\dd #2}}
\\renewcommand{\\pdiff}[2]{\\frac{\\partial #1}{\\partial #2}}
\\newcommand{\\fdiff}[2]{\\frac{\\delta #1}{\\delta #2}}
\\renewcommand{\\vec}{\\mathbf}
\\newcommand{\\hv}[1]{\\hat{\\vec{#1}}}
\\DeclareMathOperator{\\Tr}{Tr}
\\)
`
    return <>
	       <Helmet>
		   <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
		   <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
	       </Helmet>
	       <div style={{display:"None"}}>{latexHeader}</div>
	   </>
}

export default function NoteTemplate({ data }) {
    const note = data.orgContent
    const title = note.metadata.title

    return (
	<Layout>
	    <EnableLatex/>
	    <h2>{title}</h2>
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
