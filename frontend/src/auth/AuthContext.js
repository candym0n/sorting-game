import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

function concatUnique(arr1, arr2) {
    // Create a Set to store unique values
    const uniqueSet = new Set();
  
    // Helper function to check if a value is valid
    const isValid = (value) => {
      return typeof value !== 'undefined' && value !== null && !isNaN(value);
    };
  
    // Add valid values from arr1 to the set
    if (arr1) {
        arr1.forEach((value) => {
            if (isValid(value)) {
                uniqueSet.add(value);
            }
        });
    }

    // Add valid values from arr2 to the set
    if (arr2) {
        arr2.forEach((value) => {
            if (isValid(value)) {
                uniqueSet.add(value);
            }
        });
    }
  
    // Convert the set back to an array
    console.log(Array.from(uniqueSet));
    return Array.from(uniqueSet);
}

const AuthProvider = ({ children }) => {
    const [data, setData] = useState({
       logged_in: false
    });

    useEffect(() => {
        // Check for ANY sort of data
        fetch("https://localhost:3001/user/get-data", {
            credentials: "include"
        }).then(async resultAsync => {
            setTimeout(async () => {
                const result = await resultAsync.json();
                let parsedData = JSON.parse(result.data || `{}`);
                if (resultAsync.ok) {
                    console.log(parsedData.lastLevel)
                    setData({
                        logged_in: true,
                        name: result.name,
                        data: {
                            lastLevel: Math.max(data.data?.lastLevel || 0, parsedData?.lastLevel || 0),
                            seen: concatUnique(parsedData?.seen, data.data?.seen)
                        },
                        justSaved: false
                    });
                }
            }, 100)
        }).catch(()=>undefined);
    }, []);

    // Autosave
    useEffect(() => {
        if (!data.logged_in) return;
        console.log(data);
        fetch("https://localhost:3001/user/save", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data.data),
            headers: {
                'Content-Type': 'application/json'
            },
        }).catch(()=>undefined);
    }, [data]);



    return <AuthContext.Provider value={{data, setData, concatUnique}}>
        {children}
    </AuthContext.Provider>
}

const Auth = {
    Context: AuthContext,
    Provider: AuthProvider
}

export default Auth;
