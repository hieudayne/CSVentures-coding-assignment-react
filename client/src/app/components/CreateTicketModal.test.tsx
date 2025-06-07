import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTicketModal from "./CreateTicketModal";
import { createTicket as mockCreateTicket } from "../api/tickets";

jest.mock("../api/tickets", () => ({
  createTicket: jest.fn(),
}));

describe("CreateTicketModal", () => {
  const onClose = jest.fn();
  const onCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = render(
      <CreateTicketModal
        isOpen={false}
        onClose={onClose}
        onCreated={onCreated}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should render modal when isOpen is true", () => {
    render(
      <CreateTicketModal isOpen onClose={onClose} onCreated={onCreated} />
    );
    expect(
      screen.getByRole("heading", { name: /new ticket/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/describe the issue/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("should call onClose when cancel is clicked", () => {
    render(
      <CreateTicketModal isOpen onClose={onClose} onCreated={onCreated} />
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("should submit ticket and call onCreated + onClose", async () => {
    (mockCreateTicket as jest.Mock).mockResolvedValueOnce({});

    render(
      <CreateTicketModal isOpen onClose={onClose} onCreated={onCreated} />
    );

    fireEvent.change(screen.getByPlaceholderText(/describe the issue/i), {
      target: { value: "Test ticket" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /create/i }));

    // Wait for API + state updates
    await waitFor(() => {
      expect(mockCreateTicket).toHaveBeenCalledWith({
        description: "Test ticket",
      });
      expect(onCreated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should show loading spinner during submission", async () => {
    (mockCreateTicket as jest.Mock).mockImplementation(
      () => new Promise((res) => setTimeout(() => res({}), 100))
    );

    render(
      <CreateTicketModal isOpen onClose={onClose} onCreated={onCreated} />
    );

    fireEvent.change(screen.getByPlaceholderText(/describe the issue/i), {
      target: { value: "Loading test" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /create/i }));

    // Spinner should appear
    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    // Wait for final callbacks
    await waitFor(() => {
      expect(onCreated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
