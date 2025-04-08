import { useState } from 'react';
import { Button, PopupFailed, PopupSucess, CheckboxManual } from "../components/Utils";
import "../styles/Area.css"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createProduct, createUser, updateProduct, updateUser } from "../api"

function Add({ tipoDados, close, update, dado }) {
    const [form, setForm] = useState(!update ? tipoDados === "Usuário" ? {
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
    }:
    tipoDados === "Usuário" ? {
        id: dado.id,
        adm: dado.adm,
        nome: dado.nome,
        email: dado.email,
        dataNascimento: '',
        cartao: dado.cartao,
        carrinho: dado.carrinho,
        endereco: dado.endereco
    } : 
    {
        id: dado.id,
        nome: dado.nome,
        descricao: dado.descricao,
        preco: dado.preco,
        marca: dado.marca,
        urlImagem: dado.urlImagem,
        desconto: dado.desconto,
        categoria: dado.categoria,
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

    const formatterDate = (date, type) => {
        if (type === "in"){
            return date.split("/").reverse().join("-")
        }else{
            return date.split("-").reverse().join("/")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const updateCategory = (valor) => {
        let categorias = form.categoria
        if (categorias.includes(valor)){
            categorias = categorias.filter((cat) => cat !== valor)
        }else{
            categorias.push(valor)
        }
        setForm({
            ...form,
            categoria : categorias
        })
    }

    const validateForm = () => {
        let valid = true;
        let newErrors = { nome: '', email: '', senha: '', cpf: '', dataNascimento: '', descricao:"", preco:"", marca:"", urlImagem:"", };

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

            if (!update && (!form.senha || form.senha.length < 8)) {
                newErrors.senha = 'A senha deve ter pelo menos 8 caracteres';
                valid = false;
            }

            if (!update && (!form.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf))) {
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
                if (!update) {
                    tipoDados === "Produto" ? await createProduct(form) : await createUser(form);
                }else{
                    if (tipoDados === "Usuário"){
                        form.dataNascimento = formatterDate(form.dataNascimento, "out")
                    }
                    tipoDados === "Produto" ? await updateProduct(form) : await updateUser(form);
                }
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
                {
                    update ? 
                        tipoDados === "Produto" ?
                        (
                            <h2 className='header-update'>Produto de ID: {dado.id}</h2>
                        )
                        :
                        (
                            <h2 className='header-update'>Usuário de ID: {dado.id}</h2>
                        )
                    :
                    (
                        <h2>{"Adicionar " + tipoDados}</h2>
                    )
                    
                }
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
                                                value={typeof form.desconto === "string" ? 0 : form.desconto}
                                                onChange={handleChange}
                                                min="0"
                                                max="100"
                                                step="0.01"
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

                                <h3>Categorias</h3>
                                <div className="input-group input-cat">
                                    <label>
                                        <CheckboxManual name="Salgado" checked={form.categoria.includes("Salgado")} onChange={() => updateCategory("Salgado")}/>
                                        <p>Salgado</p>
                                    </label>
                                    <label>
                                        <CheckboxManual name="Doce" checked={form.categoria.includes("Doce")} onChange={() => updateCategory("Doce")}/>
                                        <p>Doce</p>
                                    </label>
                                    <label>
                                        <CheckboxManual name="Bebida" checked={form.categoria.includes("Bebida")} onChange={() => updateCategory("Bebida")}/>
                                        <p>Bebida</p>
                                    </label>
                                    <label>
                                        <CheckboxManual name="Quente" checked={form.categoria.includes("Quente")} onChange={() => updateCategory("Quente")}/>
                                        <p>Quente</p>
                                    </label>
                                    <label>
                                        <CheckboxManual name="Gelado" checked={form.categoria.includes("Gelado")} onChange={() => updateCategory("Gelado")}/>
                                        <p>Gelado</p>
                                    </label>
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
                                        {
                                            form.adm ? (<option value={true} hidden={true}>Administrador</option>) :
                                            (<option value={false}>Comum</option>)
                                        }
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

                                { update ? (<></>) : (
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
                                )}

                                <div className="cpf-dob-container">
                                { update ? (<></>) : (
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
                                )}

                                    <div className="input-group">
                                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                                        <input
                                            type="date"
                                            id="dataNascimento"
                                            name="dataNascimento"
                                            value={formatterDate(form.dataNascimento, "in")}
                                            onChange={handleChange}
                                        />
                                        {errors.dataNascimento && <span className="error">{errors.dataNascimento}</span>}
                                    </div>
                                </div>
                        </>
                        )
                    }
                    <div>
                        <Button text={update ? "Atualizar" : "Adicionar"} type="submit" className={"submit-btn"} onClick={() => handleSubmit}/>
                        <Button text={"Cancelar"} className={"btn cancel"} onClick={() => close()}/>
                    </div>
                </form>

                {showErrorPopup && (
                    <PopupFailed errorMessage={errorMessage} setShowErrorPopup={() => setShowErrorPopup(false)}/>
                )}

                {showSuccessPopup && (
                    <PopupSucess sucessMessage={update ? "Atualizado com sucesso!" : "Adicionado com sucesso!"} setShowSucessPopup={handleSuccessPopupClose}/>
                )}
            </div>
        </div>
    );
}

export default Add;