import {Imagem, Link} from "./Utils"
import logo from "../assets/images/Logo.svg"
import "../styles/components/Navbar.css"

const NavBar = () =>{
    return(
        <header>
            <div id="logo">
                <Imagem src={logo} alt="Chibi"/>
            </div>
            <div className="links-NavBar">
                <Link text="Cadastrar" to="/"/>
                <Link text="Login" to="/login"/>
                <Link text="Dados" to="/dados"/>
                <Link text="Shopping" to="/shop"/>
                <Link text="Pay" to="/pay"/>
            </div>
        </header>
    )
}

export default NavBar