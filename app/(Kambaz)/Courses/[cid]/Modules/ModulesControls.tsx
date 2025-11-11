"use client";
import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import ModuleEditor from "./ModuleEditor";
import GreenCheckmark from "./GreenCheckmark";

type ModulesControlsProps = {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
};

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
}: ModulesControlsProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div id="wd-modules-controls" className="text-nowrap">
      <Button
        variant="danger"
        onClick={handleShow}
        size="lg"
        className="me-1 float-end"
        id="wd-add-module-btn"
      >
        <FaPlus
          className="position-relative me-2"
          style={{ bottom: "1px" }}
        />
        Module
      </Button>

      <Dropdown className="float-end me-2">
        <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem id="wd-publish-all">
            <GreenCheckmark /> Publish All
          </DropdownItem>
          <DropdownItem id="wd-publish-all-modules-and-items">
            <GreenCheckmark /> Publish all modules and items
          </DropdownItem>
          <DropdownItem id="wd-publish-modules-only">
            <GreenCheckmark /> Publish modules only
          </DropdownItem>
          <DropdownItem id="wd-unpublish-all-modules-and-items-only">
            <GreenCheckmark /> Unpublish all modules
          </DropdownItem>
          <DropdownItem id="wd-unpublish-modules-only">
            <GreenCheckmark /> Unpublish modules only
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Button
        variant="secondary"
        size="lg"
        className="me-2 float-end"
        id="wd-collapse-all"
      >
        Collapse All
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="me-2 float-end"
        id="wd-view-progress"
      >
        View Progress
      </Button>

      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={() => {
          addModule();
          handleClose();
        }}
      />
    </div>
  );
}
