import './App.scss';
import LevelSelectScreen from './level-select/LevelSelectScreen';
import SectionScreen from './levels/SectionScreen';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/level-select" element={<LevelSelectScreen />} />
                <Route path="/level/:level/:section" element={<SectionScreen />} />
            </Routes>
        </Router>
    );
}

export default App;
