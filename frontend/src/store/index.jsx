import { createContext, useReducer } from "react"


const initialState = {
    // notes: [],
    // note: {},
    doDeleteNote: false,
    deletedNote: null
}

export const Context = createContext(initialState)

export const Store = ({ children }) => {

    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            // case "SET_NOTES":
            //     return {
            //         ...state,
            //         notes: action.payload
            //     }
            // case "SET_NOTE":
            //     return {
            //         ...state,
            //         note: action.payload
            //     }
            // case "GET_NOTES":
            //     return {
            //         ...state,
            //         notes: action.payload
            //     }
            case "SET_DELETE_NOTE":
                if (!action.payload) {
                    return {
                        ...state,
                        doDeleteNote: false,
                        deletedNote: null
                    }
                }

                return {
                    ...state,
                    doDeleteNote: true,
                    deletedNote: action.payload
                }
            default:
                return state
        }
    }, initialState)

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}