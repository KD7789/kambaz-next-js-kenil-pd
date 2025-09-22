import React from "react";

export default function AssignmentEditor() {
    return (
      <div id="wd-assignments-editor">
        <label htmlFor="wd-name">Assignment Name</label>
        <br />
        <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br />
        <textarea id="wd-description">
          The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.
        </textarea>
        <br /> <br />

        <table>
            <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          <tr>
            <td align="right"><label htmlFor="wd-group">Assignment Group</label></td>
            <td>
              <select id="wd-group" defaultValue="ASSIGNMENTS">
                <option>ASSIGNMENTS</option>
                <option>QUIZZES</option>
                <option>EXAMS</option>
                <option>PROJECTS</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right"><label htmlFor="wd-display-grade-as">Display Grade as</label></td>
            <td>
              <select id="wd-display-grade-as" defaultValue="Percentage">
                <option>Percentage</option>
                <option>Points</option>
                <option>Complete/Incomplete</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right"><label htmlFor="wd-submission-type">Submission Type</label></td>
            <td>
              <select id="wd-submission-type" defaultValue="Online">
                <option>Online</option>
                <option>On Paper</option>
                <option>External Tool</option>
              </select>
              <br /><br />
              <div>
                <label><input type="checkbox" id="wd-text-entry" /> Text Entry</label><br />
                <label><input type="checkbox" id="wd-website-url" /> Website URL</label><br />
                <label><input type="checkbox" id="wd-media-recordings" /> Media Recordings</label><br />
                <label><input type="checkbox"  id="wd-student-annotation" /> Student Annotation</label><br />
                <label><input type="checkbox" id="wd-file-upload" /> File Uploads</label>
              </div>
            </td>
          </tr>

          <tr>
            <td align="right"><label htmlFor="wd-assign-to">Assign to</label></td>
            <td><input id="wd-assign-to" defaultValue="Everyone" /></td>
          </tr>

          <tr>
            <td align="right"><label htmlFor="wd-due-date">Due</label></td>
            <td><input type="date" id="wd-due-date" defaultValue="2024-05-13" /></td>
          </tr>

          <tr>
            <td align="right"><label>Available from</label></td>
            <td>
              <input type="date" id="wd-available-from" defaultValue="2024-05-06" /> &nbsp; Until &nbsp;
              <input type="date" id="wd-available-until" defaultValue="2024-05-20" />
            </td>
          </tr>
        </tbody>
        </table>
        <br />
      <button>Cancel</button>
      <button>Save</button>
      </div>
  );}
  
  