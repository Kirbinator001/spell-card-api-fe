import { SxProps, Theme } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Spell } from "../../spell";
import { spellsQueryOptions } from "../../spell-queries";
import { SnackBar } from "../../components/snackbar";
import { CustomLink } from "../../components/CustomLink";

export const Route = createFileRoute("/spells/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(spellsQueryOptions),
  component: Index,
});

function Index() {
  const spellsQuery = useSuspenseQuery(spellsQueryOptions);
  const spells = spellsQuery.data;

  return <SpellTable sx={{ mb: 5 }} rows={spells}></SpellTable>;
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

interface SpellTableRowProps {
  spell: Spell;
}

function SpellTableRow({ spell }: SpellTableRowProps) {
  return (
    <TableRow tabIndex={-1}>
      <TableCell component="th" scope="row">
        <CustomLink
          to="/spells/$spellId"
          params={{
            spellId: spell.id,
          }}
        >
          {spell.name}
        </CustomLink>
      </TableCell>
    </TableRow>
  );
}

function SpellTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell key="name" align="left" padding="normal">
          Name
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
