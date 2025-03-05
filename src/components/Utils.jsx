import React from "react";
import {Link as Rota} from 'react-router-dom';
import "../styles/components/Utils.css"

/*
    Esse arquivo serve para criar componentes pequenos e muito usados.
*/

function Imagem({ src, alt, onClick}) {
    return <img src={src} alt={alt} onClick={onClick} />;
}

function Link({text, to, ...props}) {
    return <Rota to={to} {...props}>{text}</Rota>;
}

function Button({text, onClick, id}) {
    return <button id={id} onClick={onClick}>{text}</button>
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


/*
    É necessário criar os Pop-ups de Sucess e Failed
*/


export {Imagem, Link, Button, Checkbox, CheckboxManual};