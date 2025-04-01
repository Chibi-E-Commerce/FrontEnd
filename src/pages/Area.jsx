import { useState } from 'react';
import { Button, Imagem, Table, PopupFailed, PopupSucess } from "../components/Utils";
import voltar from "../assets/images/Voltar.svg"
import ordenar from "../assets/images/Ordenar.svg"
import edit from "../assets/images/Edit.svg"
import remove from "../assets/images/Trash.svg"
import filtroSearch from "../assets/images/filtroSearch.svg";
import "../styles/Area.css"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { getUsers, getProducts, deleteProduct, deleteClient, getDataFilteredRestricted, getClientFiltered, getClientSorted, getDataSorted, createProduct, createUser } from "../api"
import { useModal } from "../ModalContext";


function Add({ tipoDados, close }) {
    const [form, setForm] = useState(tipoDados === "Usuário" ? {
        adm: false,
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        dataNascimento: ''
    } : 
    {
        nome: "",
        descricao: "",
        preco: 0,
        marca: "",
        urlImagem: "",
        desconto: 0,
        categoria: []
    });

    const [errors, setErrors] = useState(tipoDados === "Produto" ? {
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        dataNascimento: ''
    } : 
    {
        nome: "",
        descricao: "",
        preco: 0,
        marca: "",
        urlImagem: "",
        desconto: 0,
        categoria: []
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "categoria"){
            let categorias = form.categoria
            console.log(categorias)
            if (categorias.includes(value)){
                categorias = categorias.filter((cat) => cat !== value)
            }else{
                categorias.push(value)
            }
            setForm({
                ...form,
                categoria : categorias
            })
        }else{
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { nome: '', email: '', senha: '', cpf: '', dataNascimento: '' };

        if (tipoDados === "Produto") {
            if (!form.nome) {
                newErrors.nome = 'Nome do produto é obrigatório';
                valid = false;
            }
        
            if (!form.descricao) {
                newErrors.descricao = 'Descrição do produto é obrigatória';
                valid = false;
            }
        
            if (form.preco <= 0 || isNaN(form.preco)) {
                newErrors.preco = 'O preço deve ser um número maior que zero';
                valid = false;
            }
        
            if (!form.marca) {
                newErrors.marca = 'A marca do produto é obrigatória';
                valid = false;
            }
        
            if (!form.urlImagem || !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(form.urlImagem)) {
                newErrors.urlImagem = 'Insira uma URL de imagem válida (jpg, jpeg, png, webp, gif)';
                valid = false;
            }
        
            if (form.desconto < 0 || form.desconto > 100 || isNaN(form.desconto)) {
                newErrors.desconto = 'O desconto deve ser um número entre 0 e 100';
                valid = false;
            }
        
            if (!Array.isArray(form.categoria) || form.categoria.length === 0) {
                newErrors.categoria = 'Pelo menos uma categoria deve ser selecionada';
                valid = false;
            }
        }else{
            if (!form.nome) {
                newErrors.nome = 'Nome é obrigatório';
                valid = false;
            }

            if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
                newErrors.email = 'Por favor, insira um e-mail válido';
                valid = false;
            }

            if (!form.senha || form.senha.length < 8) {
                newErrors.senha = 'A senha deve ter pelo menos 8 caracteres';
                valid = false;
            }

            if (!form.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf)) {
                newErrors.cpf = 'CPF inválido (use o formato 000.000.000-00)';
                valid = false;
            }

            if (!form.dataNascimento || new Date(form.dataNascimento) >= new Date(new Date().setFullYear(new Date().getFullYear() - 18))) {
                newErrors.dataNascimento = 'A Data informada é menor do que 18';
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                console.log(form)
                tipoDados === "Produto" ? await createProduct(form) : await createUser(form);
                setShowSuccessPopup(true);
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data);
                    setShowErrorPopup(true);
                } else {
                    setErrorMessage('Erro ao conectar com o servidor');
                    setShowErrorPopup(true);
                }
            }
        }
    };

    const handleSuccessPopupClose = () => {
        setShowSuccessPopup(false);
        close()
    };

    return (
        <div id='add-dado'>
            <div className="cadastro-card">
                <h2>{"Adicionar " + tipoDados}</h2>
                <form onSubmit={handleSubmit} className="cadastro-form">
                    {
                        tipoDados === "Produto" ? 
                        (
                            <>
                                <div className="input-group">
                                    <label htmlFor="nome">Nome do Produto</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={form.nome}
                                        onChange={handleChange}
                                    />
                                    {errors.nome && <span className="error">{errors.nome}</span>}
                                </div>

                                <div className="input-group input-desc">
                                    <label htmlFor="descricao">Descrição</label>
                                    <textarea
                                        id="descricao"
                                        name="descricao"
                                        value={form.descricao}
                                        onChange={handleChange}
                                    />
                                    {errors.descricao && <span className="error">{errors.descricao}</span>}
                                </div>
                            

                                    <div className='cpf-dob-container'>
                                        <div className="input-group">
                                            <label htmlFor="preco">Preço</label>
                                            <input
                                                type="number"
                                                id="preco"
                                                name="preco"
                                                value={form.preco}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                            />
                                            {errors.preco && <span className="error">{errors.preco}</span>}
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="desconto">Desconto (%)</label>
                                            <input
                                                type="number"
                                                id="desconto"
                                                name="desconto"
                                                value={form.desconto}
                                                onChange={handleChange}
                                                min="0"
                                                max="100"
                                                step="1"
                                            />
                                            {errors.desconto && <span className="error">{errors.desconto}</span>}
                                        </div>
                                        <div className='input-group'>
                                            <label htmlFor="marca">Marca</label>
                                            <input
                                                type="text"
                                                id="marca"
                                                name="marca"
                                                value={form.marca}
                                                onChange={handleChange}
                                            />
                                            {errors.marca && <span className="error">{errors.marca}</span>}
                                        </div>
                                    </div>

                                <div className="input-group">
                                    <label htmlFor="urlImagem">URL da Imagem</label>
                                    <input
                                        type="text"
                                        id="urlImagem"
                                        name="urlImagem"
                                        value={form.urlImagem}
                                        onChange={handleChange}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                    />
                                    {errors.urlImagem && <span className="error">{errors.urlImagem}</span>}
                                </div>

                                <div className="input-group input-cat">
                                    <label htmlFor="categoria">Categorias</label>
                                    <select
                                        id="categoria"
                                        name="categoria"
                                        onChange={handleChange}
                                        multiple
                                    >
                                        <option value="Salgado">Salgado</option>
                                        <option value="Doce">Doce</option>
                                        <option value="Bebida">Bebida</option>
                                        <option value="Gelado">Gelado</option>
                                        <option value="Quente">Quente</option>
                                    </select>
                                    {errors.categoria && <span className="error">{errors.categoria}</span>}
                                </div>
                            </>
                        )
                        :
                        (
                            <>
                                <div className="input-group">
                                    <label htmlFor="adm">Tipo de Conta</label>
                                    <select
                                        id="adm"
                                        name="adm"
                                        value={form.adm}
                                        onChange={handleChange}
                                    >
                                        <option value={false}>Comum</option>
                                        <option value={true}>Administrador</option>
                                    </select>
                                    {errors.nome && <span className="error">{errors.nome}</span>}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={form.nome}
                                        onChange={handleChange}
                                    />
                                    {errors.nome && <span className="error">{errors.nome}</span>}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="email">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>

                                <div className="input-group password-group">
                                    <label htmlFor="senha">Senha</label>
                                    <div className="password-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="senha"
                                            name="senha"
                                            value={form.senha}
                                            onChange={handleChange}
                                        />
                                        <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.senha && <span className="error">{errors.senha}</span>}
                                </div>

                                <div className="cpf-dob-container">
                                    <div className="input-group">
                                        <label htmlFor="cpf">CPF</label>
                                        <input
                                            type="text"
                                            id="cpf"
                                            name="cpf"
                                            value={form.cpf}
                                            onChange={handleChange}
                                            placeholder="000.000.000-00"
                                        />
                                        {errors.cpf && <span className="error">{errors.cpf}</span>}
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                                        <input
                                            type="date"
                                            id="dataNascimento"
                                            name="dataNascimento"
                                            value={form.dataNascimento}
                                            onChange={handleChange}
                                        />
                                        {errors.dataNascimento && <span className="error">{errors.dataNascimento}</span>}
                                    </div>
                                </div>
                        </>
                        )
                    }
                    <button type="submit" className="submit-btn">ADICIONAR</button>
                </form>

                {showErrorPopup && (
                    <PopupFailed errorMessage={errorMessage} setShowErrorPopup={() => setShowErrorPopup(false)}/>
                )}

                {showSuccessPopup && (
                    <PopupSucess sucessMessage="Adicionado com sucesso!" setShowSucessPopup={handleSuccessPopupClose}/>
                )}
            </div>
        </div>
    );
}

function Area({}) {
    const navigate = useNavigate()
    const [dados, setDados] = useState(["nada"])
    const [tipoDados, setTipoDados] = useState("")
    const [showDelete, setShowDelete] = useState(-1)
    const { open, close, openModal}  = useModal()

    const getDados = async (num) => {
        setDados(num === 1 ? await getUsers() : await getProducts())
        setShowDelete(-1)
        setTipoDados(num === 1 ? "Usuário" : "Produto")
    }

    const deleteDado = async (valor) => {
        if (tipoDados === "Produto") {
            await deleteProduct(valor)
        }else{
            await deleteClient(valor)
        }
        await getDados(tipoDados === "Produto" ? 2 : 1)
    }

    const search = async (e) => {
        const valor = e.target.value.trim()
        if (!valor) {
            await getDados(tipoDados === "Produto" ? 2 : 1)
            return;
        }
        const filter = tipoDados === "Produto"
            ? {
                "pesquisa": valor,
                "precoMin": 0,
                "precoMax": 0,
                "inDesconto": 0,
                "categoria": [valor],
                "marca": valor
            }
            : {
                "nome": valor,
                "email": valor,
                "cpf": valor
            };
        setDados(tipoDados === "Produto"
            ? await getDataFilteredRestricted(filter)
            : await getClientFiltered(filter))
    };

    const sorted = async () => {
        setDados(tipoDados === "Produto"
            ? await getDataSorted()
            : await getClientSorted()
        )
    }
    

    return(
        <main id="area-restrita">
            <section id="side-bar">
                <div id='main-side-bar'>
                    <div>
                        <div id="header">
                            <h1>Gestão</h1>
                        </div>
                        <ul>
                            <li onClick={() => getDados(1)}>Usuários</li>
                            <li onClick={() => getDados(2)}>Produtos</li>
                            <li onClick={() => navigate("/dash")}>Dashboard</li>
                        </ul>
                    </div>

                    <div id="voltar" onClick={() => {navigate("/shop")}}>
                        <Imagem src={voltar} alt="Voltar"/>
                        <h1>Voltar</h1>
                    </div>
                </div>
            </section>
        
            <section>
                {
                    dados[0] === "nada" ? (
                        <h1>
                            Bem-Vindo a Area de Administradores
                        </h1>
                    ) : (
                        <>
                            <div id="search-dados">
                                <input
                                    type="text"
                                    name="pesquisa"
                                    placeholder="Pesquisar produto"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    onChange={search}
                                />
                                <div>
                                    <Imagem src={filtroSearch} alt="Procura produto" />
                                </div>
                                <div id='ordenar' onClick={() => sorted()}>
                                    <Imagem src={ordenar} alt="Ordenar" />
                                </div>
                                <div id='add' onClick={() => open("add")}>
                                    <p>+</p>
                                </div>
                            </div>
                            
                            <ul id="dados">
                                {
                                    dados.map((dado, ind) => (
                                        <li key={ind} className='dado'>
                                            <div className='dado-header'>
                                                <div id='image-product-header'>
                                                    { dado.urlImagem && <Imagem src={dado.urlImagem} alt={dado.nome}/>}
                                                    <h3>{dado.nome}</h3>
                                                </div>
                                                <div>
                                                    <div className={"icon " + ind}>
                                                        <Imagem src={edit} alt="Editar"/>
                                                    </div>
                                                    <div className='icon'>
                                                        <Imagem src={remove} alt={"Deletar"} onClick={() => {setShowDelete(ind)}}/>
                                                    </div>
                                                </div>
                                            </div> 

                                            <Table object={dado} keys={Object.keys(dado)} ind={ind}/>
                                            {showDelete === ind && (
                                                <div id='modal-delete'>
                                                    <h3>Deseja apagar esse {tipoDados}?</h3>
                                                    <div className='buttons'>
                                                        <Button text={"Cancelar"} onClick={() => {
                                                            setShowDelete(-1)
                                                        }}/>
                                                        <Button text={"Deletar"} onClick={() => deleteDado(tipoDados === "Produto" ? dado.id : dado.email)}/>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    )
                }
                {openModal === "add" && (
                    <Add tipoDados={tipoDados} close={() => close()}/>
                )}
            </section>
        </main>
    )
}

export default Area;