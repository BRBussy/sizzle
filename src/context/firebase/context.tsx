import React, {useState, SetStateAction, Dispatch, useContext} from 'react'
import Firebase from './Firebase'

interface context {
    firebase: null | Firebase,
    setFirebase: Dispatch<SetStateAction<Firebase>>,

    user: any,
    setUser: Dispatch<SetStateAction<{}>>,
}

const Context = React.createContext({} as context)

function FirebaseContext({children}: {children: React.ReactNode}) {
    const [firebase, setFirebase] = useState(new Firebase())
    const [user, setUser] = useState({})

    return (
        <Context.Provider
            value={{
                firebase,
                setFirebase,
                user,
                setUser,
            }}
        >
            {children}
        </Context.Provider>
    )
}

const useFirebaseContext = () => useContext(Context)
export {
    useFirebaseContext,
}
export default FirebaseContext