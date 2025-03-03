import '../styles/components/Cartao.css';


const Cartao = ({key, numero}) => {
    return (
        <div className="cartao">
            <p className="center">{numero}</p>
        </div>
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