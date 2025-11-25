"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";

import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

import { addModule, editModule, updateModule, deleteModule } from "./reducer";

export default function Modules() {
  const { cid } = useParams<{ cid: string }>();

  const dispatch = useDispatch();
  const { modules } = useSelector((state: RootState) => state.modulesReducer);

  // ⭐ Get logged-in user
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  // ⭐ Determine if user has permissions
  const isPrivileged =
    currentUser?.role === "FACULTY" ||
    currentUser?.role === "TA" ||
    currentUser?.role === "ADMIN";

  const [moduleName, setModuleName] = useState("");

  const filteredModules = modules.filter((module) => module.course === cid);

  return (
    <div style={{ marginLeft: "30px", marginRight: "30px" }}>
      
      {/* ⭐ Only faculty/TA/admin can add modules */}
      {isPrivileged && (
        <ModulesControls
          setModuleName={setModuleName}
          moduleName={moduleName}
          addModule={() => {
            dispatch(addModule({ name: moduleName, course: cid }));
            setModuleName("");
          }}
        />
      )}

      <br />
      <br />
      <br />

      <ListGroup id="wd-modules" className="rounded-0">
        {filteredModules.map((module) => (
          <ListGroupItem
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />

              {/* Title or inline edit field */}
              {!module.editing && module.name}

              {module.editing && isPrivileged && (
                <FormControl
                  className="w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(updateModule({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      dispatch(updateModule({ ...module, editing: false }));
                    }
                  }}
                  defaultValue={module.name}
                />
              )}

              {/* ⭐ Control buttons only for privileged roles */}
              {isPrivileged && (
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => {
                    dispatch(deleteModule(moduleId));
                  }}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                />
              )}
            </div>

            {/* Lessons */}
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson) => (
                  <ListGroupItem
                    key={lesson._id}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}

                    {/* ⭐ Lesson buttons also only for privileged users */}
                    {isPrivileged && <LessonControlButtons />}
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
