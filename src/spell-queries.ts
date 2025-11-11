import { queryOptions, useMutation } from "@tanstack/react-query";
import { NewSpell, Spell } from "./spell";
import {
  createSpell,
  deleteSpell,
  fetchSpell,
  fetchSpells,
  updateSpell,
} from "./spell-service";

export const spellsQueryOptions = queryOptions({
  queryKey: ["spells"],
  queryFn: () => fetchSpells(),
});

export const spellQueryOptions = (spellId: string) => {
  return queryOptions({
    queryKey: ["spells", spellId],
    queryFn: () => fetchSpell(spellId),
  });
};

export const useCreateSpellMutation = () => {
  return useMutation({
    mutationFn: (newSpell: NewSpell) => createSpell(newSpell),
  });
};

export const useUpdateSpellMutation = () => {
  return useMutation({
    mutationFn: (spell: Spell) => updateSpell(spell),
  });
};

export const useDeleteSpellMutation = () => {
  return useMutation({
    mutationFn: (spellId: string) => deleteSpell(spellId),
  });
};
