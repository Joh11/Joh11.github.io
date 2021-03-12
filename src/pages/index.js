import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"

export default function Index({ data }) {
    return (
	<Layout>
	    <p>
		Hi ! My name is Johan Félisaz, I am a Physics Master student at
		EPFL, Lausanne, Switzerland. 
	    </p>
	    <div style={{
		     "text-align": "center"
		 }}>
		<StaticImage
		    src="../images/profile_pic2_cropped.jpeg"
		    alt="Picture of myself, on top of a snowy mountain"
		    style={{
			"border-radius": "0.5em",
			"width": "20em"
		    }}
		/>
	    </div>
	</Layout>
    )
}
