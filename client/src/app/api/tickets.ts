// src/app/api/tickets.ts
import { Ticket } from "@acme/shared-models";

export async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch("/api/tickets");
  return res.json();
}

export async function fetchTicket(id: string | number): Promise<Ticket> {
  const res = await fetch(`/api/tickets/${id}`);
  return res.json();
}

export async function markTicketComplete(ticketId: number): Promise<void> {
  const res = await fetch(`/api/tickets/${ticketId}/complete`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to mark ticket as complete");
}

export async function markTicketIncomplete(ticketId: number): Promise<void> {
  const res = await fetch(`/api/tickets/${ticketId}/complete`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to mark ticket as incomplete");
}

export async function createTicket(data: { description: string }) {
  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create ticket");
  return res.json();
}

export async function assignUserToTicket(
  ticketId: number,
  userId: number | null
): Promise<void> {
  const url =
    userId === null
      ? `/api/tickets/${ticketId}/assign`
      : `/api/tickets/${ticketId}/assign/${userId}`;

  const res = await fetch(url, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to assign user");
}
