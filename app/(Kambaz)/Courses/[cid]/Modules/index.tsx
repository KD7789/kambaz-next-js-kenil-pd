// app/(Kambaz)/Courses/[cid]/Modules/index.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  addModule,
  editModule,
  updateModule as updateModuleReducer,
  deleteModule as deleteModuleReducer,
  setModules,
} from "./reducer";
import * as coursesClient from "../../client";
import { RootState } from "@/app/(Kambaz)/store";
import ModulesControls from "../Modules/ModulesControls";
import ModuleControlButtons from "../Modules/ModuleControlButtons";

export default function Modules() {
  const params = useParams();
  const cid = params?.cid as string;
  const dispatch = useDispatch();

  const [moduleName, setModuleName] = useState("");

  const { modules } = useSelector((state: RootState) => state.modulesReducer);

  if (!cid) return <div>Loading course...</div>;

  // CREATE
  const onCreateModuleForCourse = async () => {
    const newModule = { name: moduleName, course: cid };
    const module = await coursesClient.createModuleForCourse(cid, newModule);
    dispatch(setModules([...modules, module]));
    setModuleName("");
  };

  // DELETE
  const onRemoveModule = async (moduleId: string) => {
    await coursesClient.deleteModule(moduleId);
    dispatch(setModules(modules.filter((m) => m._id !== moduleId)));
  };

  // ⭐ UPDATE MODULE
  const onUpdateModule = async (module: any) => {
    await coursesClient.updateModule(module);
    const newModules = modules.map((m) =>
      m._id === module._id ? module : m
    );
    dispatch(setModules(newModules));
  };

  const loadModules = async () => {
    const list = await coursesClient.findModulesForCourse(cid);
    dispatch(setModules(list));
  };

  useEffect(() => {
    loadModules();
  }, [cid]);

  return (
    <div>
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={onCreateModuleForCourse}
      />

      <ul className="list-group mt-3">
        {modules.map((module: any) => (
          <li
            key={module._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {/* ⭐ VIEW MODE */}
            {!module.editing && module.name}

            {/* ⭐ EDIT MODE */}
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
                    onUpdateModule({ ...module, editing: false });
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
