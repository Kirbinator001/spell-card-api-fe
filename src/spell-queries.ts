import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "./main";
import {
  deleteSpell,
  fetchSpell,
  fetchSpells,
  updateSpell,
} from "./spell-service";
import { Spell } from "./spell";

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

export const useUpdateSpellMutation = () => {
  return useMutation({
    mutationFn: (spell: Spell) => updateSpell(spell),
    onSuccess: (_, spell) => {
      queryClient.invalidateQueries({ queryKey: ["spells", spell.id] });
    },
  });
};

export const useDeleteSpellMutation = (spellId: string) => {
  return useMutation({
    mutationKey: ["spells", "delete"],
    mutationFn: () => deleteSpell(spellId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spells", spellId] });
    },
  });
};
