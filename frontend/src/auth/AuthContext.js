import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [data, setData] = useState({
       logged_in: false
    });

    useEffect(() => {
        // Check for ANY sort of data
        fetch("https://localhost:3001/user/get-data", {
            credentials: "include"
        }).then(async resultAsync => {
            const result = await resultAsync.json();
            if (resultAsync.ok) {
                setData({
                    logged_in: true,
                    name: result.name,
                    data: result.data
                });
            }
        }).catch();
    }, []);

    return <AuthContext.Provider value={{data, setData}}>
        {children}
    </AuthContext.Provider>
}

const Auth = {
    Context: AuthContext,
    Provider: AuthProvider
}

export default Auth;
