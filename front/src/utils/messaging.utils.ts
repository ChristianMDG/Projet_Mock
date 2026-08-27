import ShortUniqueId from 'short-unique-id';
import { customStorage } from './customStorage';
import { useAuthStore } from '@/stores/auth.store';
import dayjs from '@/utils/dayjs';

const NAVIGATOR_ROOM_KEY = 'navigator_room';

export interface NavigatorRoom {
  senderId: string;
  roomId: string;
  userName?: string;
  createdAt: string;
  lastActivity: string;
}

export function getNavigatorRoom(): NavigatorRoom {
  const roomJson = customStorage.getItem(NAVIGATOR_ROOM_KEY);
  if (roomJson) {
    try {
      return JSON.parse(roomJson);
    } catch {
      return {} as NavigatorRoom;
    }
  }
  return {} as NavigatorRoom;
}

export function setNavigatorRoom(room: NavigatorRoom): void {
  customStorage.setItem(NAVIGATOR_ROOM_KEY, JSON.stringify(room));
}

/**
 * Updates the roomId in the NavigatorRoom stored in localStorage.
 * This ensures the roomId persists across page reloads.
 * @param roomId The room ID to store
 */
export function updateNavigatorRoomId(roomId: string): void {
  const existingRoom = getNavigatorRoom();
  if (existingRoom.senderId) {
    setNavigatorRoom({
      ...existingRoom,
      roomId,
      lastActivity: dayjs().tz('Indian/Antananarivo').toISOString(),
    });
  }
}

/**
 * Gets the roomId from localStorage, or creates a new room via API and persists it.
 * @param createRoom Function to call API to create a room (returns roomId)
 * @returns The roomId
 */
export async function getOrInitRoomId(createRoom: () => Promise<{ roomId: string }>): Promise<string> {
  const room = getNavigatorRoom();
  if (room.roomId) {
    return room.roomId;
  }
  const newRoom = await createRoom();
  updateNavigatorRoomId(newRoom.roomId);
  return newRoom.roomId;
}

/**
 * Initializes a NavigatorRoom with a unique senderId.
 * If a room already exists in localStorage, it returns the existing room.
 * Otherwise, it creates a new room with a generated senderId and stores it.
 * @returns The existing or newly created NavigatorRoom
 */
export function initNavigatorRoom(): NavigatorRoom {
  const existingRoom = getNavigatorRoom();
  const { user } = useAuthStore.getState();

  if (existingRoom.senderId) {
    return existingRoom;
  }

  const uid = new ShortUniqueId({ length: 16 });
  const now = dayjs().tz('Indian/Antananarivo').toISOString();

  const newRoom: NavigatorRoom = {
    senderId: uid.rnd(),
    roomId: '',
    createdAt: now,
    lastActivity: now,
    userName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
  };

  setNavigatorRoom(newRoom);
  return newRoom;
}
