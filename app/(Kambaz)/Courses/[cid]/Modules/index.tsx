"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  editModule,
  updateModule as updateModuleReducer,
  setModules,
} from "./reducer";
import * as coursesClient from "../../client";
import { RootState } from "@/app/(Kambaz)/store";
import ModulesControls from "../Modules/ModulesControls";
import ModuleControlButtons from "../Modules/ModuleControlButtons";

/* --------------------------
   Types
-------------------------- */
export interface Module {
  _id: string;
  name: string;
  course: string;
  editing?: boolean;
}

export default function Modules() {
  const params = useParams();
  const cid = params?.cid as string | undefined;
  const dispatch = useDispatch();

  const [moduleName, setModuleName] = useState("");

  const { modules } = useSelector((state: RootState) => state.modulesReducer);

  /* --------------------------
     Load modules (with useCallback)
  -------------------------- */
  const loadModules = useCallback(async () => {
    if (!cid) return;
    const list: Module[] = await coursesClient.findModulesForCourse(cid);
    dispatch(setModules(list));
  }, [cid, dispatch]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  /* Loading state */
  if (!cid) {
    return <div>Loading course...</div>;
  }

  /* --------------------------
     CREATE
  -------------------------- */
  const onCreateModuleForCourse = async () => {
    const newModule = { name: moduleName, course: cid };
    const createdModule: Module = await coursesClient.createModuleForCourse(
      cid,
      newModule
    );
    dispatch(setModules([...modules, createdModule]));
    setModuleName("");
  };

  /* --------------------------
     DELETE
  -------------------------- */
  const onRemoveModule = async (moduleId: string) => {
    await coursesClient.deleteModule(cid, moduleId);
    dispatch(setModules(modules.filter((m: Module) => m._id !== moduleId)));
  };  

  /* --------------------------
     UPDATE
  -------------------------- */
  const onUpdateModule = async (module: Module) => {
    await coursesClient.updateModule(cid as string, module);
    const newModules = modules.map((m: Module) =>
      m._id === module._id ? module : m
    );
    dispatch(setModules(newModules));
  };

  return (
    <div>
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={onCreateModuleForCourse}
      />

      <ul className="list-group mt-3">
        {modules.map((module: Module) => (
          <li
            key={module._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {/* VIEW MODE */}
            {!module.editing && module.name}

            {/* EDIT MODE */}
            {module.editing && (
              <input
                className="form-control w-50 d-inline-block"
                value={module.name}
                onChange={(e) =>
                  dispatch(
                    updateModuleReducer({
                      ...module,
                      name: e.target.value,
                    })
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const newName = (e.target as HTMLInputElement).value;
                    onUpdateModule({ ...module, name: newName, editing: false });
                  }
                }}                
              />
            )}

            <ModuleControlButtons
              moduleId={module._id}
              deleteModule={() => onRemoveModule(module._id)}
              editModule={() => dispatch(editModule(module._id))}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
