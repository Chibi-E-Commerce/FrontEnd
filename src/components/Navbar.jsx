import { Imagem} from "./Utils"
import logo from "../assets/images/Logo.svg"
import cadeado from "../assets/images/Cadeado.svg"
import carrinhoIcon from "../assets/images/CarIcon.svg"
import "../styles/components/Navbar.css"
import CarSide from "./CarSide"
import { useModal } from "../ModalContext"
import { UserContext } from "../UserContext"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

const NavBar = ({ carrinho, area}) => {
  const { open, close, openModal } = useModal()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const openSideCar = () => {
    open("sideCar")
  }

  const openArea = () => {
    navigate("/area")
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
          {
            user?.adm && area ? (
              <div id="area-icon" onClick={openArea}>
                <Imagem src={cadeado} alt="Area-Restrita" />
              </div>
            ) : (<></>)
          }
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
