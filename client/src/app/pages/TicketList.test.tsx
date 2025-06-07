// @ts-nocheck
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TicketList from "./TicketList";

const mockTickets = [
  {
    id: "1",
    title: "Bug A",
    description: "Issue with login",
    completed: false,
  },
  {
    id: "2",
    title: "Bug B",
    description: "Landing page update",
    completed: true,
  },
  { id: "3", title: "Bug C", description: "Dashboard fix", completed: false },
];

jest.mock("../api/tickets", () => ({
  fetchTickets: jest.fn(() => Promise.resolve(mockTickets)),
}));

describe("TicketList (with mock fetchTickets)", () => {
  test("renders correct number of tickets", async () => {
    render(<TicketList />, { wrapper: MemoryRouter });

    await waitFor(() => {
      const tickets = screen.getAllByTestId("ticket-item");
      expect(tickets.length).toBe(3);
    });
  });

  test("filters completed tickets", async () => {
    render(<TicketList />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getAllByTestId("ticket-item").length).toBe(3);
    });

    const dropdown = screen.getByRole("combobox");
    fireEvent.change(dropdown, { target: { value: "completed" } });

    await waitFor(() => {
      const completed = screen.getAllByTestId("ticket-item");
      expect(completed.length).toBe(1);
      expect(completed[0]).toHaveTextContent("Landing page update");
    });
  });

  test("filters pending tickets", async () => {
    render(<TicketList />, { wrapper: MemoryRouter });

    await waitFor(() => {
      const dropdown = screen.getByRole("combobox");
      fireEvent.change(dropdown, { target: { value: "pending" } });
    });

    await waitFor(() => {
      const pending = screen.getAllByTestId("ticket-item");
      expect(pending.length).toBe(2);
    });
  });
});
