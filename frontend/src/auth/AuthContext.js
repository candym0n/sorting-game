import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [data, setData] = useState({
        logged_in: false,
        name: "",
        levelData: []
    });

    const updateData = () => {
        fetch("https://localhost:3001/user/get-data", {
            credentials: "include",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(async resultAsync => {
            setTimeout(async () => {
                const result = await resultAsync.json();
                if (resultAsync.ok) {
                    setData({
                        logged_in: true,
                        name: result.name,
                        levelData: result.data
                    });
                }
            }, 100)
        }).catch(() => undefined);
    }

    useEffect(updateData, []);

    // Insert something into data.levelData
    const addLevelData = (level, score) => {
        setData(prev => ({
            logged_in: prev.logged_in,
            name: prev.name,
            levelData: [...prev.levelData, {
                index: level,
                score: score
            }]
        }));

        if (!data.logged_in) return;

        fetch("https://localhost:3001/user/save", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ level, score })
        }).then(res => {
            console.log(res);
        });
    }

    // Set the login status
    const setLoginData = (logged_in, name) => {
        setData(prev => ({
            logged_in, name,
            levelData: prev.levelData
        }));
    }

    return <AuthContext.Provider value={{ data, addLevelData, setLoginData, updateData }}>
        {children}
    </AuthContext.Provider>
}

const Auth = {
    Context: AuthContext,
    Provider: AuthProvider
}

export default Auth;
