import * as React from "react"
import { Helmet } from "react-helmet"

import "../styles/global.css"

import Header from "./header"
import Footer from "./footer"

export default function Layout({ children }) {
    return <>
	       <Helmet>
		   <title>Johan Félisaz</title>
	       </Helmet>
	       <Header/>
	       { children }
	       <Footer/>
	   </>
}
