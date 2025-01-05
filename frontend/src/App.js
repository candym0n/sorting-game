import Login from './auth/Login';
import SignUp from "./auth/SignUp";
import SignOut from "./auth/SignOut";
import './App.scss';
import LevelSelectScreen from './level-select/LevelSelectScreen';
import LevelScreen from './levels/LevelScreen';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Auth from './auth/AuthContext';

function App() {
    return (
        <Auth.Provider>
            <Router>
                <Routes>
                    <Route path="/level-select" element={<LevelSelectScreen />} />
                    <Route path="/level/:level" element={<LevelScreen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signout" element={<SignOut />} />
                    <Route path="*" element={<Navigate to="/level-select" />} />
                </Routes>
            </Router>
        </Auth.Provider>
    );
}

export default App;
