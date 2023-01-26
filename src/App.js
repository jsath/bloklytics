import './App.css';
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Analytics } from '@vercel/analytics/react';
import Collection from './components/Collection';
import MetaConnect from './components/MetaConnect';
import Market from './components/Market';
import Navbar from './components/Navbar';
import CoinChart from './components/CoinChart';
import Swap from './components/Swap';
import {
  Routes,
  Route
} from "react-router-dom";


function App() {

  const activeChainId = ChainId.Ethereum;

  return (
    <div className="App">
    <ThirdwebProvider desiredChainId={activeChainId}>
    <Navbar/>
    <Routes>
        <Route path="/" element={<Market/>} />
        <Route path="/wallet" element={<MetaConnect/>} />
        <Route path="/currencies/:id" element={<CoinChart/>} />
        <Route path="/collection/:addy" element={<Collection/>} />
        <Route path="/wallet/swap" element={<Swap/>} />
      </Routes>
    </ThirdwebProvider>
    <Analytics />
    </div>
  );
}

export default App;
