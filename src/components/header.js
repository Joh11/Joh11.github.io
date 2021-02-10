import * as React from "react"
import { Link } from "gatsby"

// import gpg from "../misc/jfelisaz.gpg"

function OuterMenuLink({ children }) {
    return <li style={{ "list-style-type": "none",
		      }}>
	       {children}
	   </li>
}

function GPGMenuLink() {
    return <OuterMenuLink>
	       <a href="/jfelisaz.gpg">GPG</a>
	   </OuterMenuLink>
}

function MenuLink({ to, children }) {
    return <OuterMenuLink>
	       <Link to={to}>{children}</Link>
	   </OuterMenuLink>
}

export default function Header() {
    return <header>
	       <h1>Johan FÉLISAZ</h1>
	       <nav>
		   <ul style={{ display: "flex",
			        "justify-content": "space-around"}}>
		       <MenuLink to="/">Home</MenuLink>
		       <MenuLink to="/projects">Projects</MenuLink>
		       <GPGMenuLink/>
		       <MenuLink to="/about">About</MenuLink>
		   </ul>
	       </nav>
	   </header>
}
