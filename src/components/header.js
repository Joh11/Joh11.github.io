import * as React from "react"
import { Link } from "gatsby"

function MenuLink({ to, children }) {
    return <li style={{ "list-style-type": "none",
			
		      }}>
	       <Link to={to}>{children}</Link>
	   </li>
}

export default function Header() {
    return <header>
	       <h1>Johan FÉLISAZ</h1>
	       <nav>
		   <ul style={{ display: "flex",
			        "justify-content": "space-around"}}>
		       <MenuLink to="/">Home</MenuLink>
		       <MenuLink to="/about">About</MenuLink>
		   </ul>
	       </nav>
	   </header>
}
