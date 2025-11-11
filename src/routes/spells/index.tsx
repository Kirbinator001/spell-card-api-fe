import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Stack, SxProps, Theme, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useConfirm } from "material-ui-confirm";
import { useMemo, useState } from "react";
import { CustomLink } from "../../components/CustomLink";
import { Spell } from "../../spell";
import { Route as createSpellRoute } from "./create.tsx";

import {
  spellsQueryOptions,
  useDeleteSpellMutation,
} from "../../spell-queries";
import { CustomButtonLink } from "../../components/CustomButtonLink.tsx";

export const Route = createFileRoute("/spells/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(spellsQueryOptions),
  component: Index,
});

function Index() {
  const spellsQuery = useSuspenseQuery(spellsQueryOptions);
  const spells = spellsQuery.data;

  return (
    <Stack>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <CustomLink
          from={Route.path}
          to={Route.to}
          underline="hover"
          color="inherit"
        >
          Spells
        </CustomLink>
      </Breadcrumbs>
      <Typography variant="h4">Spells</Typography>
      <Stack direction="row-reverse" mb={2}>
        <CustomButtonLink
          from={Route.path}
          to={createSpellRoute.to}
          type="button"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create new
        </CustomButtonLink>
      </Stack>
      <SpellTable sx={{ mb: 5 }} rows={spells}></SpellTable>
    </Stack>
  );
}

interface SpellTableProps {
  rows: Spell[];
  sx: SxProps<Theme> | undefined;
}

export function SpellTable({ rows, sx }: SpellTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, page, rowsPerPage]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Paper sx={{ ...sx, width: "100%" }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="spellTableTitle"
            size="medium"
          >
            <SpellTableHead />
            <TableBody>
              {visibleRows.map((spell) => (
                <SpellTableRow spell={spell} key={spell.id} />
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

function SpellTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell key="name" align="left" padding="normal">
          Name
        </TableCell>
        <TableCell key="actions" padding="normal" />
      </TableRow>
    </TableHead>
  );
}

interface SpellTableRowProps {
  spell: Spell;
}

function SpellTableRow({ spell }: SpellTableRowProps) {
  const confirm = useConfirm();
  const deleteSpellMutation = useDeleteSpellMutation();

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: "Delete spell?",
      description: `Are you sure you wish to delete the "${spell.name}" spell?`,
      confirmationText: "Delete",
      cancellationText: "Cancel",
      cancellationButtonProps: { color: "error" },
    });

    if (confirmed) {
      deleteSpellMutation.mutate(spell.id);
    }
  };

  return (
    <TableRow tabIndex={-1}>
      <TableCell component="th" scope="col">
        <CustomLink
          to="/spells/$spellId"
          params={{
            spellId: spell.id,
          }}
        >
          {spell.name}
        </CustomLink>
      </TableCell>
      <TableCell component="th" scope="col">
        <Stack direction="row" justifyContent="flex-end">
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
