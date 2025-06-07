import { Ticket } from "@acme/shared-models";
import { Link } from "react-router-dom";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      to={`/${ticket.id}`}
      data-testid="ticket-item"
      className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition border border-gray-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Ticket #{ticket.id}
        </h3>
        <span
          className={`text-sm px-2 py-1 rounded-full font-medium
            ${
              ticket.completed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {ticket.completed ? "Completed" : "Pending"}
        </span>
      </div>
      <p className="text-gray-600">{ticket.description}</p>
    </Link>
  );
}
