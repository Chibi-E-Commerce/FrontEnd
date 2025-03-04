import '../styles/components/Cartao.css';


const Cartao = ({key, numero}) => {
    return (
        <button className="cartao" onClick={(e) => e.preventDefault()}>
            <p className="center">{numero}</p>
        </button>
    )
}

const Cartoes = ({numeros}) => {
    return (
        <div className='cartao-box'>
            <h2 className='pagamento-title'>Cartões</h2>
            <div className='cartao-container'>
                {numeros.map(
                    (num, i) => <Cartao key={i} numero={num}></Cartao>
                )}
            </div>
        </div>
    )
}

export default Cartoes