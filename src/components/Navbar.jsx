import { Imagem, Link } from "./Utils"
import logo from "../assets/images/Logo.svg"
import carrinhoIcon from "../assets/images/CarIcon.svg"
import "../styles/components/Navbar.css"
import CarSide from "./CarSide"
import { useModal } from "../ModalContext"

const NavBar = ({ carrinho }) => {
  const { open, close, openModal } = useModal()

  const openSideCar = () => {
    open("sideCar")
  }

  const closeShowSideCar = () => {
    close()
  }

  return (
    <header>
      <div id="logo">
        <Imagem src={logo} alt="Chibi" />
      </div>
      <div className="header-div">
        {carrinho ? (
          <div id="carrinho-icon" onClick={openSideCar}>
            <Imagem src={carrinhoIcon} alt="Carrinho" />
          </div>
        ) : (
          <></>
        )}
      </div>
      {openModal === "sideCar" && (
        <CarSide closeShowSide={closeShowSideCar} /> 
      )}
    </header>
  )
}

export default NavBar
