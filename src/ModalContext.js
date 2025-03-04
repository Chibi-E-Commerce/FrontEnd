import React, { createContext, useState, useContext } from 'react'

const ModalContext = createContext()

export function ModalProvider({ children }) {
    const [openModal, setOpenModal] = useState(null)

    const open = (modalName) => {
        setOpenModal(modalName)
    }

    const close = () => {
        setOpenModal(null)
    }

    return (
        <ModalContext.Provider value={{ openModal, open, close }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    return useContext(ModalContext)
}
