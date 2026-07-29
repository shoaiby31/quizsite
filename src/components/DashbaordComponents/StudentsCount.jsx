import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../config/firebase";
import { Skeleton } from "@mui/material";

const StudentsCount = ({ children }) => {
  const [count, setCount] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Listen for auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setUserData(null);
        return;
      }

      const userRef = doc(db, "users", u.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    });

    return () => unsubAuth();
  }, []);

  // Listen for students
  useEffect(() => {
    if (!user || !userData) return;

    let q;

    if (userData.role === "admin") {
      q = query(
        collection(db, "studentTeacherRelations"),
        where("schoolUid", "==", userData.schoolUid)
      );
    } else {
      // Teacher
      q = query(
        collection(db, "studentTeacherRelations"),
        where("teacherUid", "==", user.uid)
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      setCount(snap.size);
    });

    return () => unsub();
  }, [user, userData]);

  if (count === null) {
    return <Skeleton variant="text" width={40} />;
  }

  return children(count);
};

export default StudentsCount;