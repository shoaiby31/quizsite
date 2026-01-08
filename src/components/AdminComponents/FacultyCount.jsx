import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../config/firebase";
import { Skeleton } from "@mui/material";

const FacultyCount = ({ children }) => {
  const [count, setCount] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "teacherAdminRelations"),
      where("adminUid", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setCount(snap.size);
    });

    return () => unsub();
  }, [user]);

  if (count === null) {
    return <Skeleton variant="text" width={40} />;
  }

  return children(count);
};

export default FacultyCount;
