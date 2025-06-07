import { useState } from "react";
import { createTicket } from "../api/tickets";
import Spinner from "./Spinner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTicketModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createTicket({ description });
    setLoading(false);
    setDescription("");
    onCreated();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">📝 New Ticket</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border rounded p-2 mb-4"
            rows={4}
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? <Spinner size="sm" inline /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
