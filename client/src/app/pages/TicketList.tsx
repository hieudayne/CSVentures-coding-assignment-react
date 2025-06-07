import { useEffect, useState } from "react";
import { Ticket } from "@acme/shared-models";
import TicketCard from "../components/TicketCard";
import CreateTicketModal from "../components/CreateTicketModal";
import { fetchTickets } from "../api/tickets";
import Spinner from "../components/Spinner";

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await fetchTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "completed") return ticket.completed;
    if (filter === "pending") return !ticket.completed;
    return true; // "all"
  });

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <label className="text-sm text-gray-700 font-medium mr-2">
            Filter:
          </label>
          <select
            className="border px-3 py-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Ticket
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.length === 0 ? (
            <div className="text-gray-500 text-center">No tickets found.</div>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      )}

      <CreateTicketModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadTickets}
      />
    </div>
  );
}
