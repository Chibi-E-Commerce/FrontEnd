import React from "react";
import {Link as Rota} from 'react-router-dom';

/*
    Esse arquivo serve para criar componentes pequenos e muito usados.
*/

function Imagem({ src, alt, onClick}) {
    return <img src={src} alt={alt} onClick={onClick} />;
}

function Link({text, to, ...props}) {
    return <Rota to={to} {...props}>{text}</Rota>;
}

function Button({text, onClick}) {
    return <button onClick={onClick}>{text}</button>
}

export {Imagem, Link, Button};