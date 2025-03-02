import '../styles/components/Cartao.css';


const Cartao = ({numero}) => {
    return (
        <div className="cartao">
            <p className="center">{numero}</p>
        </div>
    )
}

const Cartoes = ({numeros}) => {
    return (
        <div className='cartao-box'>
            <h2>Cartões</h2>
            <div className='cartao-container'>
                {numeros.map(
                    (num) => <Cartao numero={num}></Cartao>
                )}
            </div>
        </div>
    )
}

export default Cartoes