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

function Checkbox({name}) {
    const addClassChecked = (e) => {
        const span = e.target.parentElement.parentElement
        if (e.target.checked) {
            span.classList.add("checked")
        }else{
            span.classList.remove("checked")
        }
    }

    return (
        <>
            <span>
                <div className="checkmark">
                    <input type="checkbox" name={name} onChange={addClassChecked} className="checkbox"/>
                </div>
            </span>
        </>
    )
}

export {Imagem, Link, Button, Checkbox};