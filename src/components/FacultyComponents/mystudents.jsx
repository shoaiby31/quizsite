import React, { useEffect, useMemo, useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Checkbox, TextField, TablePagination, Skeleton, Alert, Button } from "@mui/material";
import { collection, query, where, onSnapshot, getDocs, writeBatch, doc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const StudentsByTeacherTable = ({ selectedTeacherUid }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Auth & role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      setCurrentUser(user);

      const snap = await getDocs(
        query(collection(db, "users"), where("uid", "==", user.uid))
      );
      if (!snap.empty) setRole(snap.docs[0].data().role);
    });

    return () => unsub();
  }, []);

  const teacherUidToUse = useMemo(() => {
    if (!currentUser || !role) return null;
    if (role === "teacher") return currentUser.uid;
    if (role === "admin") return selectedTeacherUid || null;
    return null;
  }, [currentUser, role, selectedTeacherUid]);

  // Real-time students
  useEffect(() => {
    if (!teacherUidToUse) return;

    const q = query(
      collection(db, "studentTeacherRelations"),
      where("teacherUid", "==", teacherUidToUse)
    );

    const unsub = onSnapshot(q, async (snap) => {
      setLoading(true);

      const relations = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const uids = relations.map((r) => r.studentUid);

      if (!uids.length) {
        setRows([]);
        setLoading(false);
        return;
      }

      const userSnaps = await Promise.all(
        uids.map((uid) =>
          getDocs(query(collection(db, "users"), where("uid", "==", uid)))
        )
      );

      const merged = relations.map((r, i) => ({
        relationId: r.id,
        studentUid: r.studentUid,
        ...userSnaps[i].docs[0]?.data(),
      }));

      setRows(merged);
      setLoading(false);
    });

    return () => unsub();
  }, [teacherUidToUse]);

  // Search filter
  const filteredRows = useMemo(() => {
    return rows.filter(
      (r) =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.phone?.includes(search)
    );
  }, [rows, search]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  // Batch delete (teacher only)
  const handleBatchDelete = async () => {
    if (role !== "teacher" || !selected.length) return;
    if (!window.confirm(`Remove ${selected.length} students?`)) return;

    const batch = writeBatch(db);
    selected.forEach((id) =>
      batch.delete(doc(db, "studentTeacherRelations", id))
    );
    await batch.commit();
    setSelected([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedRows.map((r) => r.relationId));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (!teacherUidToUse && role === "admin") {
    return <Alert severity="info">Select a teacher to view students.</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          size="small"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {role === "teacher" && selected.length > 0 && (
          <Button color="error" onClick={handleBatchDelete}>
            Delete Selected ({selected.length})
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {role === "teacher" && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selected.length === paginatedRows.length &&
                      paginatedRows.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton height={40} />
                  </TableCell>
                </TableRow>
              ))}

            {!loading &&
              paginatedRows.map((r) => (
                <TableRow key={r.studentUid}>
                  {role === "teacher" && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(r.relationId)}
                        onChange={() => toggleSelect(r.relationId)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{r.name || "—"}</TableCell>
                  <TableCell>{r.email || "—"}</TableCell>
                  <TableCell>{r.phone || "—"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
};

export default StudentsByTeacherTable;
