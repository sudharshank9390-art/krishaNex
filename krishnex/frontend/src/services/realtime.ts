import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', { autoConnect: false });

export function subscribeToProcurementUpdates(onUpdate: () => void): () => void {
  socket.connect();
  const events = ['token:created', 'token:arrived', 'token:weighed', 'token:quality-checked', 'token:procured', 'token:status-changed', 'queue:updated', 'payment:updated'];
  events.forEach((event) => socket.on(event, onUpdate));
  return () => { events.forEach((event) => socket.off(event, onUpdate)); };
}