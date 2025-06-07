import { Routes, Route } from "react-router-dom";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";

export function App() {
  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">🎟️ Ticketing App</h1>
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/:id" element={<TicketDetail />} />
      </Routes>
    </div>
  );
}

export default App;
