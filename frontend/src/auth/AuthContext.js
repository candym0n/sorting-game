import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [data, setData] = useState({
       logged_in: false,
       name: ""
    });

    useEffect(() => {
        // Check for ANY sort of data
        fetch("https://localhost:3001/user/get-data", {
            credentials: "include"
        }).then(async resultAsync => {
            setTimeout(async () => {
                const result = await resultAsync.json();
                if (resultAsync.ok) {
                    setData({
                        logged_in: true,
                        name: result.name
                    });
                }
            }, 100)
        }).catch(()=>undefined);
    }, []);

    // Autosave
    useEffect(() => {
        if (!data.logged_in) return;
        console.log(data);
    }, [data]);

    return <AuthContext.Provider value={{data, setData }}>
        {children}
    </AuthContext.Provider>
}

const Auth = {
    Context: AuthContext,
    Provider: AuthProvider
}

export default Auth;
