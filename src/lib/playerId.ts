import { getStorageItem, setStorageItem } from "./storage";

const KEY = "nb_player_id";

export function getPlayerId(): string {
  const existing = getStorageItem<string>(KEY, "");
  if (existing) return existing;
  const id = crypto.randomUUID();
  setStorageItem(KEY, id);
  return id;
}
