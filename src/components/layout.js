import * as React from "react"

import "../styles/global.css"

import Header from "./header"
import Footer from "./footer"

export default function Layout({ children }) {
    return <>
	       <Header/>
	       { children }
	       <Footer/>
	   </>
}
