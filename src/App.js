import './App.css';
import Collection from './components/Collection';
import MetaConnect from './components/MetaConnect';
import Market from './components/Market';
import CoinInfo from './components/CoinInfo';
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
        <Route path="/" element={<MetaConnect/>} />
        <Route path="/market" element={<Market/>} />
        <Route path="/market/coin/:id" element={<><CoinChart/><CoinInfo/></>} />
        <Route path="/collection/:addy" element={<Collection/>} />
      </Routes>
    </div>
  );
}

export default App;
