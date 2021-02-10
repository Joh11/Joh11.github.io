const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const result = await graphql(`
{
  allOrgContent {
    nodes {
      id
      slug
    }
  }
}`)

    result.data.allOrgContent.nodes.forEach((node) => {
	createPage({
	    path: node.slug,
	    component: path.resolve(`src/templates/note-template.js`),
	    context: {
		slug: node.slug
	    }
	})
    })
}
