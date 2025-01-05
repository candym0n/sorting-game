import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [data, setData] = useState({
       logged_in: false
    });
    return <AuthContext.Provider value={{data, setData}}>
        {children}
    </AuthContext.Provider>
}

const Auth = {
    Context: AuthContext,
    Provider: AuthProvider
}

export default Auth;
