import './App.css';
import Collection from './components/Collection';
import MetaConnect from './components/MetaConnect';
import Market from './components/Market';
import Navbar from './components/Navbar';
import CoinChart from './components/CoinChart';
import {
  Routes,
  Route
} from "react-router-dom";


function App() {
  return (
    <div className="App">

    <Navbar/>
    <Routes>
        <Route path="/" element={<Market/>} />
        <Route path="/wallet" element={<MetaConnect/>} />
        <Route path="/currencies/:id" element={<><CoinChart/></>} />
        <Route path="/collection/:addy" element={<Collection/>} />
      </Routes>
    </div>
  );
}

export default App;
