import {Imagem, Link} from "./Utils"
import logo from "../assets/images/Logo.svg"
import carrinhoIcon from "../assets/images/CarIcon.svg"
import "../styles/components/Navbar.css"

const NavBar = ({carrinho}) =>{
    console.log(carrinho)
    return(
        <header>
            <div id="logo">
                <Imagem src={logo} alt="Chibi"/>
            </div>
            <div>
                <Link text="Página Inicial" to="/"/>
                <Link text="Dados" to="/dados"/>
                <Link text="Shopping" to="/shop"/>

                {
                    carrinho ?
                    (
                        <div id="carrinho-icon">
                            <Imagem src={carrinhoIcon} alt="Carrinho"/>
                        </div>
                    ) :
                    (
                        <></>
                    )
                }
            </div>
        </header>
    )
}

export default NavBar