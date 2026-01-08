import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../config/firebase";

export const approveTeacherRequest = async (req, adminUid) => {
  const { userUid, institutePassword, id, email, secretCode, address, phone, qualification } = req;

  if (!userUid || !institutePassword || !id) {
    throw new Error("Missing required data");
  }

  // Check if already exists
  const existingQuery = query(
    collection(db, "teacherAdminRelations"),
    where("teacherEmail", "==", email),
    where("institutePassword", "==", institutePassword)
  );

  const existingSnap = await getDocs(existingQuery);
  if (!existingSnap.empty) {
    await deleteDoc(doc(db, "teacherRequests", id));
    return;
  }

  // Create relation
  await addDoc(collection(db, "teacherAdminRelations"), {
    adminUid,
    institutePassword,
    teacherUid: userUid,
    teacherSecretId: secretCode,
    assignedAt: serverTimestamp()
  });

  // Update user profile
  await updateDoc(doc(db, "users", userUid), {
    role: "teacher",
    teacherSecretId: secretCode,
    address,
    phone,
    qualification
  });

  // Delete request
  await deleteDoc(doc(db, "teacherRequests", id));
};

export const denyTeacherRequest = async (requestId) => {
  await deleteDoc(doc(db, "teacherRequests", requestId));
};
