import React from "react";
import {Link as Rota} from 'react-router-dom';
import "../styles/components/Utils.css"
import errorImage from '../../src/assets/images/error.svg';
import sucessfulImage from '../../src/assets/images/sucesso.svg';

/*
    Esse arquivo serve para criar componentes pequenos e muito usados.
*/

function Imagem({ src, alt, onClick, className}) {
    return <img src={src} alt={alt} onClick={onClick} className={className} />;
}

function Link({text, to, ...props}) {
    return <Rota to={to} {...props}>{text}</Rota>;
}

function Button({text, onClick, id, className}) {
    return <button id={id} onClick={onClick} className={className}>{text}</button>
}

function Checkbox({ name, onChange }) {
    const addClassChecked = (e) => {
        const span = e.target.parentElement.parentElement
        if (e.target.checked) {
            span.classList.remove("unchecked")
            span.classList.add("checked")
        }else {
            span.classList.remove("checked")
            span.classList.add("unchecked")
        }

        if (onChange) {
            onChange(e)
        }
    };

    return (
        <>
            <div className="unchecked" onChange={addClassChecked}>
                <div className="checkmark">
                    <input type="checkbox" name={name} onChange={addClassChecked} className="checkbox"/>
                </div>
            </div>
        </>
    )
}

/* A diferença desse Checkbox é que o controle de checked ou unchecked é manual */

function CheckboxManual({ name, checked, onChange }) {
    return (
        <div className={checked ? "checked" : "unchecked"} onClick={onChange}>
            <div className="checkmark">
                <input type="checkbox" name={name} checked={checked} className="checkbox" readOnly />
            </div>
        </div>
    );
}

function PopupSucess({ sucessMessage, setShowSucessPopup }) {
    return (
        <div className="success-popup">
            <div className="success-popup-content">
                <p>{sucessMessage}</p>
                <img src={sucessfulImage} alt="Sucessful" />
            </div>
            <button className="success-popup-button" onClick={setShowSucessPopup}>
                    OK
            </button>
        </div>
    )
}

function PopupFailed({ errorMessage, setShowErrorPopup }) {
    return (
        <div className="error-popup">
            <div className="error-popup-content">
                <p>{errorMessage}</p>
                <img src={errorImage} alt="Error" />
            </div>
            <button className="error-popup-button" onClick={setShowErrorPopup}>
                VOLTAR
            </button>
        </div>
    )
}





export {Imagem, Link, Button, Checkbox, CheckboxManual, PopupFailed, PopupSucess};