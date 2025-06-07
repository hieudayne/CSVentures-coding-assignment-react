// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TicketDetail from "./TicketDetail";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fetchTicket, markTicketComplete } from "../api/tickets";
import { fetchUsers } from "../api/users";

jest.mock("../api/tickets");
jest.mock("../api/users");

const mockTicket = {
  id: 1,
  description: "Fix login issue",
  completed: false,
  assigneeId: null,
};

const mockUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

describe("TicketDetail", () => {
  beforeEach(() => {
    (fetchTicket as jest.Mock).mockResolvedValue(mockTicket);
    (fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
  });

  it("renders ticket detail correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <Routes>
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Fix login issue/i)).toBeInTheDocument();
    expect(screen.getByText("⏳ Pending")).toBeInTheDocument();
    expect(screen.getByText("Assigned To")).toBeInTheDocument();
  });

  it("marks ticket as complete", async () => {
    (markTicketComplete as jest.Mock).mockResolvedValue({});
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <Routes>
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const button = await screen.findByText("Mark as Complete");
    fireEvent.click(button);

    await waitFor(() => {
      expect(markTicketComplete).toHaveBeenCalledWith(1);
    });
  });
});
