import './App.css';
import Collection from './components/Collection';
import MetaConnect from './components/MetaConnect';
import Market from './components/Market';
import {
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div className="App">


    <Routes>
        <Route path="/" element={<MetaConnect/>} />
        <Route path="/market" element={<Market/>} />
        <Route path="/collection/:addy" element={<Collection/>} />
      </Routes>
    </div>
  );
}

export default App;
