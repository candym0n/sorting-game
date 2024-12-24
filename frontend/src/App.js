import './App.scss';
import LevelSelectScreen from './level-select/LevelSelectScreen';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/level-select" element={<LevelSelectScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
