import React from "react";
import {Link as Rota} from 'react-router-dom';

/*
    Esse arquivo serve para criar componentes pequenos e muito usados.
*/

function Imagem({ src, alt}) {
    return <img src={src} alt={alt} />;
}

function Link({text, to, ...props}) {
    return <Rota to={to} {...props}>{text}</Rota>;
}

export {Imagem, Link};