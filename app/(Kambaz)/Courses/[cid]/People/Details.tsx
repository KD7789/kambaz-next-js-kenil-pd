"use client";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { FormControl } from "react-bootstrap";
import type { UpdateUserPayload } from "../../../Account/client";
import * as client from "../../../Account/client";

export default function PeopleDetails({
  uid,
  onClose,
}: {
  uid: string | null;
  onClose: () => void;
}) {

  const [user, setUser] = useState<Record<string, unknown>>({});
  const [name, setName] = useState("");              // ⭐ NEW
  const [editing, setEditing] = useState(false);     // ⭐ NEW

  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
  };

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    onClose();
  };

  // ⭐ NEW — Update user
  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");

    const updatedUser = {
      ...user,
      firstName,
      lastName,
    };

    await client.updateUser(updatedUser as unknown as UpdateUserPayload);
    setUser(updatedUser);
    setEditing(false);
    onClose();
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>

      {/* ICON */}
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />

      {/* ⭐ EDITABLE NAME SECTION */}
      <div className="text-danger fs-4">

        {/* Pencil (edit mode off) */}
        {!editing && (
          <FaPencil
            onClick={() => {
              setEditing(true);
              setName(
                `${user.firstName as string} ${user.lastName as string}`
              );
            }}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}

        {/* Checkmark (save) */}
        {editing && (
          <FaCheck
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}

        {/* Display name when NOT editing */}
        {!editing && (
          <div
            className="wd-name"
            onClick={() => {
              setEditing(true);
              setName(
                `${user.firstName as string} ${user.lastName as string}`
              );
            }}
            style={{ cursor: "pointer" }}
          >
            {user.firstName as string} {user.lastName as string}
          </div>
        )}

        {/* Input box when editing */}
        {editing && (
          <FormControl
            className="w-75 wd-edit-name"
            defaultValue={`${user.firstName as string} ${user.lastName as string}`}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          />
        )}
      </div>

      {/* DETAILS BELOW NAME */}
      <b>Roles:</b>
      <span className="wd-roles">{user.role as string}</span> <br />

      <b>Login ID:</b>
      <span className="wd-login-id">{user.loginId as string}</span> <br />

      <b>Section:</b>
      <span className="wd-section">{user.section as string}</span> <br />

      <b>Total Activity:</b>
      <span className="wd-total-activity">{user.totalActivity as string}</span>

      <hr />

      {/* DELETE + CANCEL BUTTONS (your original code preserved) */}
      <button
        onClick={() => deleteUser(uid)}
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>
      <button
        onClick={onClose}
        className="btn btn-secondary float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}