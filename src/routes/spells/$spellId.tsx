import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  spellQueryOptions,
  useUpdateSpellMutation,
} from "../../spell-queries.ts";
import { useState } from "react";
import { CustomLink } from "../../components/CustomLink.tsx";
import { Route as spellsRoute } from "./index.tsx";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNotificationContext } from "../../hooks/useNotificationContext.ts";

export const Route = createFileRoute("/spells/$spellId")({
  loader: ({ context: { queryClient }, params: { spellId } }) => {
    return queryClient.ensureQueryData(spellQueryOptions(spellId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const spellId = Route.useParams().spellId;
  const { data: spell } = useSuspenseQuery(spellQueryOptions(spellId));
  const [name, setName] = useState(spell.name);
  const updateSpell = useUpdateSpellMutation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { showNotification } = useNotificationContext();

  return (
    <Stack mx={2}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <CustomLink
          to={spellsRoute.to}
          underline="hover"
          color="inherit"
        >
          Spells
        </CustomLink>
        <Typography sx={{ color: "text.primary" }}>{spell.name}</Typography>,
      </Breadcrumbs>
      <Stack spacing={2}>
        <Typography variant="h4">{spell.name} - Edit</Typography>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateSpell.mutate(
              { id: spellId, name },
              {
                onSuccess: () => {
                  navigate({ to: spellsRoute.to });
                  showNotification(`"${name}" updated successfully`, "success");
                },
              }
            );
          }}
        >
          <Stack>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>
          <Stack direction="row" justifyContent="flex-end" mt={2} spacing={2}>
            <Button type="submit" variant="contained">
              Edit
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
}
