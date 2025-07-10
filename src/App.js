import Login from "./Routes/Login";
import Menu from "./Routes/Menu";
import SeatSelector from "./Routes/SeatSelector";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Pembayaran from "./Components/Pembayaran";
import CreateTiket from "./Routes/Createtiket";
import Jadwal from "./Routes/Jadwal";
import Profil from "./Routes/Profil";
import Register from "./Routes/Register";
import MainMenu from "./Routes/Menu";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="Register/" element={<Register />} />
          <Route path="menu/" element={<MainMenu />} />
          <Route path="menu/SeatSelector/:id/:type" element={<SeatSelector />} />
          <Route path="tiket/Payment/:id/:type/:Total" element={<Pembayaran />} />
          <Route path="CreateTiket/" element={<CreateTiket />} />
          <Route path="Jadwal/" element={<Jadwal />} />
          <Route path="Profil/" element={<Profil />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
