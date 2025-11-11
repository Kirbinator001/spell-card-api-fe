import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Breadcrumbs,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CustomLink } from "../../components/CustomLink";
import { Route as spellsRoute } from "./index.tsx";
import { useCreateSpellMutation } from "../../spell-queries.ts";
import { useNotificationContext } from "../../hooks/useNotificationContext.ts";

export const Route = createFileRoute("/spells/create")({
  component: RouteComponent,
});

interface IFormInputs {
  Name: string;
}

function RouteComponent() {
  const createSpell = useCreateSpellMutation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { showNotification } = useNotificationContext();

  const { handleSubmit, control } = useForm<IFormInputs>({
    defaultValues: {
      Name: "",
    },
  });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    createSpell.mutate(
      { name: data.Name },
      {
        onSuccess: () => {
          navigate({ to: spellsRoute.to });
          showNotification(`"${data.Name}" spell created successfully`, "success");
        },
      }
    );
  };

  return (
    <Stack mx={2}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <CustomLink
          from={Route.path}
          to={spellsRoute.to}
          underline="hover"
          color="inherit"
        >
          Spells
        </CustomLink>
        <Typography sx={{ color: "text.primary" }}>New Spell</Typography>
      </Breadcrumbs>
      <Stack spacing={2}>
        <Typography variant="h4">New Spell</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="Name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField {...field} label="Name" required />
            )}
          />
          <Button type="submit" variant="contained">
            Create
          </Button>
        </form>
      </Stack>
    </Stack>
  );
}
