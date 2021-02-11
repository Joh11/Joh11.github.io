import * as React from "react"
import { Link } from "gatsby"

function OuterMenuLink({ children }) {
    return <li style={{ "list-style-type": "none",
		      }}>
	       {children}
	   </li>
}

function GPGMenuLink() {
    return <OuterMenuLink>
	       <Link href="/jfelisaz.gpg">GPG</Link>
	   </OuterMenuLink>
}

function MenuLink({ to, children }) {
    return <OuterMenuLink>
	       <Link to={to}>{children}</Link>
	   </OuterMenuLink>
}

export default function Header() {
    return <header>
	       <h1>Johan Félisaz</h1>
	       <nav>
		   <ul style={{ display: "flex",
			        "justify-content": "space-around"}}>
		       <MenuLink to="/">Home</MenuLink>
		       <MenuLink to="/projects">Projects</MenuLink>
		       <MenuLink to="/notes">Notes</MenuLink>
		       <GPGMenuLink/>
		       <MenuLink to="/about">About</MenuLink>
		   </ul>
	       </nav>
	   </header>
}
