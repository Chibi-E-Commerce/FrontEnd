import '../styles/components/Cartao.css';
import { Imagem } from './Utils';
import masterCard from "../assets/images/Mastercard.svg"
import visa from "../assets/images/Visa.svg"
import elo from "../assets/images/Elo.svg"
import amex from "../assets/images/Amex.svg"
import { useState } from 'react';


const Cartao = ({ cartao, onClick }) => {

    const [checked, setChecked] = useState(false)

    const showBandeira = () => {
        switch (cartao.bandeira) {
            case "MasterCard":
                return masterCard
            case "Visa":
                return visa
            case "Elo":
                return elo
            default:
                return amex
        }
    }


    const formaterNum = () => {
        let num = ""
        for (let i = 0; i < cartao.numero.length; i++){
            if (i % 4 == 0){
                num+=" "
            }
            num += cartao.numero[i]
        }
        return num
    }

    const checkButton = (e) => {
        e.preventDefault()

        const button = e.target.closest("button")
        if (!checked) {
            button.classList.add("cartao-checked")
        }else{
            button.classList.remove("cartao-checked")
        }
        setChecked(!checked)

        onClick(cartao)
    }

    return (
        <button className="cartao" onClick={checkButton}>
            <span></span>
            <div className='cartao-row'>
                <div>
                    <p>NÚMERO DO CARTÃO</p>
                    <h5>{formaterNum()}</h5>
                </div>
                <Imagem src={showBandeira()} alt={cartao.bandeira}/>
            </div>
        </button>
    )
}

const Cartoes = ({ cartoes, onClick }) => {
    return (
        <div className='cartao-box'>
            <h2 className='pagamento-title'>Cartões</h2>
            <div className='cartao-container'>
                {cartoes.length > 0 ? cartoes.map(
                    (cartao, i) => <Cartao key={i} cartao={cartao} onClick={onClick}></Cartao>
                ) : (<></>)}
            </div>
        </div>
    )
}

export default Cartoes