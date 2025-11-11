import axios from "./axios";
import { NewSpell, Spell } from "./spell";

export async function fetchSpells(): Promise<Spell[]> {
  const response = await axios.get("/api/spells");
  return response.data as Spell[];
}

export async function fetchSpell(spellId: string): Promise<Spell> {
  const response = await axios.get(`/api/spells/${spellId}`);
  return response.data as Spell;
}

export async function createSpell(newSpell: NewSpell): Promise<void> {
  await axios.post("/api/spells", newSpell);
}

export async function updateSpell(spell: Spell): Promise<void> {
  await axios.put(`/api/spells/${spell.id}`, spell);
}

export async function deleteSpell(spellId: string): Promise<void> {
  await axios.delete(`/api/spells/${spellId}`);
}
