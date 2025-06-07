import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Ticket, User } from "@acme/shared-models";
import { fetchUsers } from "../api/users";
import {
  assignUserToTicket,
  fetchTicket,
  markTicketComplete,
  markTicketIncomplete,
} from "../api/tickets";
import { toast } from "../../utils/toast";
import Spinner from "../components/Spinner";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchTicket(id).then(setTicket);
    fetchUsers().then(setUsers);
  }, [id]);

  const toggleStatus = async () => {
    if (!ticket) return;
    setLoading(true);
    try {
      if (ticket.completed) {
        await markTicketIncomplete(ticket.id);
        toast("🔄 Marked as incomplete.");
      } else {
        await markTicketComplete(ticket.id);
        toast("✅ Marked as complete.");
      }
      const updated = await fetchTicket(ticket.id);
      setTicket(updated);
    } catch (err) {
      console.error(err);
      toast("❌ Failed to update ticket status");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!ticket) return;
    const userId = e.target.value ? Number(e.target.value) : null;
    setLoading(true);
    try {
      await assignUserToTicket(ticket.id, userId);
      const updated = await fetchTicket(ticket.id);
      setTicket(updated);
      toast("🙋 User assigned successfully");
    } catch (error) {
      console.error("Failed to assign user", error);
      toast("❌ Failed to assign user");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return <Spinner />;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md shadow-sm hover:bg-gray-200 active:scale-[.98] transition text-sm font-medium"
      >
        <span className="text-base">←</span>
        <span>Back</span>
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Ticket #{ticket.id}
      </h2>
      <p className="text-gray-700 mb-4">{ticket.description}</p>

      <div className="mb-4">
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${
            ticket.completed
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {ticket.completed ? "✅ Completed" : "⏳ Pending"}
        </span>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">
          Assigned To
        </label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={ticket.assigneeId ?? ""}
          onChange={handleAssign}
          disabled={loading}
        >
          <option value="">-- Unassigned --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={toggleStatus}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? (
          <Spinner size="sm" inline />
        ) : ticket.completed ? (
          "Mark as Incomplete"
        ) : (
          "Mark as Complete"
        )}
      </button>
    </div>
  );
}
