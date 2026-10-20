import React from "react";
import CreditSimulator from "./components/CreditSimulator";
import InfoPagos from "./components/InfoPagos";
import Footer from "./components/Footer";
import ParticlesBackground from "./components/ParticlesBackground";
import './App.css';


function App() {
  return (
    <div className="App">
      <ParticlesBackground />
      <CreditSimulator />
      <InfoPagos />
      <Footer />
    </div>
  );
}

export default App;
