import React, { createContext, useState } from 'react'

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null)

    const addUser = (user) => {
        if (user){
            setUser(user)
            localStorage.setItem("user", JSON.stringify(user))
        }
    }

    return (
        <UserContext.Provider value={{ user, addUser }}>
            {children}
        </UserContext.Provider>
    )
}
