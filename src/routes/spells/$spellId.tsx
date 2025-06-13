import {
  Alert,
  Breadcrumbs,
  Collapse,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  spellQueryOptions,
  useUpdateSpellMutation,
} from "../../spell-queries.ts";
import { useState } from "react";
import { CustomLink } from "../../components/CustomLink.tsx";
import { Route as spellsRoute } from "./index.tsx";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";

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
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  return (
    <Stack mx={2}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <CustomLink
          from={Route.fullPath}
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
              { onSuccess: () => setSnackBarOpen(true) }
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
      <SnackBar
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message={` The ${name} spell has been succesfully updated`}
      />
    </Stack>
  );
}

function SnackBar({
  open,
  setOpen,
  message,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
