module.exports = {
    siteMetadata: {
	title: "Personal website",
    },
    plugins: ["react-helmet",
	      "gatsby-plugin-react-helmet",
	      {
		  resolve: `gatsby-source-filesystem`,
		  options: {
		      name: `src`,
		      path: `${__dirname}/src/`,
		  }
	      },
	      `gatsby-transformer-remark`,
	      `gatsby-transformer-orga`,
	      `gatsby-plugin-image`,
	      `gatsby-plugin-sharp`,
	      `gatsby-transformer-sharp`],
};
