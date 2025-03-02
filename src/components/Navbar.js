import {Imagem, Link} from "./Utils"
import logo from "../assets/images/Logo.svg"
import "../styles/components/Navbar.css"

const NavBar = () =>{
    return(
        <header>
            <div id="logo">
                <Imagem src={logo} alt="Chibi"/>
            </div>
            <div>
                <Link text="Página Inicial" to="/"/>
                <Link text="Dados" to="/dados"/>
                <Link text="Shopping" to="/shop"/>
            </div>
        </header>
    )
}

export default NavBar