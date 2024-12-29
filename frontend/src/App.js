import './App.scss';
import LevelSelectScreen from './level-select/LevelSelectScreen';
import LevelScreen from './levels/LevelScreen';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/level-select" element={<LevelSelectScreen />} />
                <Route path="/level/:level" element={<LevelScreen />} />
            </Routes>
        </Router>
    );
}

export default App;
