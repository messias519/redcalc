import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CalculadoraDeDoses from './pages/calculadoraDeDoses';
import Reposicao from './pages/reposicao';
import EditorTexto from './pages/editorTexto';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>RedCalc</h1>
        </header>
        <div className="app-content">
          <nav className="app-sidebar">
            <ul>
              <li><Link to="/calculadora-doses"> Calculadora de Doses</Link></li>
              <li><Link to="/reposicao"> Reposição</Link></li>
              <li><Link to="/editor-texto"> Editor de Texto</Link></li>
            </ul>
          </nav>
          <main className="app-main">
            <Routes>
              <Route path="/calculadora-doses" element={<CalculadoraDeDoses />} />
              <Route path="/reposicao" element={<Reposicao />} />
              <Route path="/editor-texto" element={<EditorTexto />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
