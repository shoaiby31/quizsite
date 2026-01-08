import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Accept a single student join request.
 * @param {Object} request - The student join request object
 * @param {string} adminUid - UID of the currently logged in admin
 */
export const acceptStudentRequest = async (request, adminUid) => {
  const {
    studentEmail,
    className,
    teacherSecretId,
    id,
    rollNo,
    phone,
    address,
    studentId
  } = request;
  if (!studentEmail || !className || !teacherSecretId || !id) {
    throw new Error("Missing required data in request.");
  }

  // Check if relation already exists
  const existingQuery = query(
    collection(db, "studentTeacherRelations"),
    where("studentEmail", "==", studentEmail),
    where("className", "==", className),
    where("teacherSecretId", "==", teacherSecretId)
  );

  const existingSnap = await getDocs(existingQuery);
  if (!existingSnap.empty) {
    // Already joined, remove the pending request
    await deleteDoc(doc(db, "joinRequests", id));
    return;
  }

  // Add student-teacher relation
  await addDoc(collection(db, "studentTeacherRelations"), {
      teacherUid: adminUid,
      studentUid: studentId,
      teacherSecretId,
      assignedAt: serverTimestamp()
    });

    // Update user profile
      await updateDoc(doc(db, "users", studentId), {
        role: "student",
        rollNo,
        className,
        phone,
        address
      });

  // Delete the request after accepting
  await deleteDoc(doc(db, "joinRequests", id));
};

/**
 * Deny a single student join request
 * @param {string} requestId - ID of the join request document
 */
export const denyStudentRequest = async (requestId) => {
  if (!requestId) throw new Error("Missing requestId");
  await deleteDoc(doc(db, "joinRequests", requestId));
};
