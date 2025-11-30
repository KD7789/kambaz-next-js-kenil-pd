"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

import {
  addModule,
  editModule,
  updateModule,
  setModules,
} from "./reducer";

import * as client from "../../client";

/* ------------------------------------------
   Types
------------------------------------------ */
interface Lesson {
  _id: string;
  name: string;
}

interface Module {
  _id: string;
  name: string;
  course: string;
  editing?: boolean;
  lessons?: Lesson[];
}

/* ------------------------------------------ */

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
const user = currentUser as { role?: string } | null;
const isFaculty = user?.role === "FACULTY";


  const [moduleName, setModuleName] = useState("");

  /* ------------------------------------------
     Fetch Modules
  ------------------------------------------ */
  const fetchModules = useCallback(async () => {
    if (!cid) return;
    const mods: Module[] = await client.findModulesForCourse(cid as string);
    dispatch(setModules(mods));
  }, [cid, dispatch]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  /* ------------------------------------------
     DELETE Module
  ------------------------------------------ */
  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(cid as string, moduleId);
    dispatch(setModules(modules.filter((m: Module) => m._id !== moduleId)));
  };  

  /* ------------------------------------------
     UPDATE Module
  ------------------------------------------ */
  const onUpdateModule = async (module: Module) => {
    await client.updateModule(cid as string, module);
    const newModules = modules.map((m: Module) =>
      m._id === module._id ? module : m
    );
    dispatch(setModules(newModules));
  };

  return (
    <div style={{ marginLeft: "30px", marginRight: "30px" }}>

      {/* -------------------------------------
          FACULTY-ONLY: + Module Controls
      ------------------------------------- */}
      {isFaculty && (
        <ModulesControls
          setModuleName={setModuleName}
          moduleName={moduleName}
          addModule={async () => {
            if (!moduleName.trim()) return;
          
            // 1. Save to server (MongoDB)
            const saved = await client.createModuleForCourse(cid as string, {
              name: moduleName,
              course: cid as string,
            });
          
            // 2. Refresh modules from server
            fetchModules();
          
            // 3. Clear input
            setModuleName("");
          }}
          
        />
      )}

      <br /><br /><br />

      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: Module) => (
          <ListGroupItem
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            {/* TITLE BAR */}
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />

              {/* VIEW MODE */}
              {!module.editing && module.name}

              {/* EDIT MODE (faculty only) */}
              {module.editing && isFaculty && (
                <FormControl
                  className="w-50 d-inline-block"
                  defaultValue={module.name}
                  onChange={(e) =>
                    dispatch(updateModule({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateModule({ ...module, editing: false });
                    }
                  }}
                />
              )}

              {/* FACULTY-ONLY Module Buttons */}
              {isFaculty && (
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(id) => onRemoveModule(id)}
                  editModule={(id) => dispatch(editModule(id))}
                />
              )}
            </div>

            {/* LESSONS */}
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: Lesson) => (
                  <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}

                    {/* FACULTY-ONLY lesson controls */}
                    {isFaculty && <LessonControlButtons />}
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
