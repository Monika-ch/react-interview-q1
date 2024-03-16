import React, { useState, useEffect } from "react";
import { isNameValid, getLocations } from "../mock-api/apis";
import "../styled-components/Form.css";

const FormComponent = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  // State for name error (assuming name to be a valid string)
  const [nameError, setNameError] = useState("");
  // State for table data (assuming an array of objects)
  const [tableData, setTableData] = useState([]);

  // Fetch location options from mock API
  useEffect(() => {
    getLocations()
      .then((data) => {
        setLocationOptions(data);
        // Set the first location from api as the selected location
        setLocation(data[0]);
      })
      .catch((error) =>
        console.error("Error fetching location options:", error)
      );
  }, []);

  // Check if the name already exists in the table data
  const nameExistsInTable = (tableData, name) =>
    tableData.some((entry) => entry.name.toUpperCase() === name.toUpperCase());

  // Validate name as user types
  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);

    // Validate against mock API
    isNameValid(newName)
      .then((isValid) => {
        if (!isValid) {
          // Display error message
          setNameError("The name is invalid");
        } else {
          // Check if the name already exists in the table data
          if (nameExistsInTable(tableData, newName)) {
            // If the name exists, set an error message
            setNameError("this name has already been taken");
          } else {
            // If the name doesn't exist, clear the error message
            setNameError("");
          }
        }
      })
      .catch((error) =>
        console.error("Error checking name availability:", error)
      );
  };

  // Resets the form, table data and error message
  const handleClear = () => {
    setName("");
    setLocation(locationOptions[0]);
    setTableData([]);
    setNameError("");
  };

  // Handles adding form data to info-table after validating
  const handleAddInfo = (event) => {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // Check if the name and location fields are filled.
    // The name checks only for empty string or white spaces.
    // More advanced validations for efficiency can be added as required.
    if (name.trim() === "" || location === "") {
      // Alert the user
      alert("Both name and location are required! They cannot be empty!");
    } else {
      // Check if the name already exists in the table data
      if (nameExistsInTable(tableData, name)) {
        // If the name exists, set an error message
        setNameError("this name has already been taken");
      } else {
        // If the name doesn't exist, add the new entry and clear the input fields
        const newEntry = { name, location };
        setTableData((prevData) => [...prevData, newEntry]);
        setName("");
        setLocation(locationOptions[0]);
        setNameError("");
      }
    }
  };

  return (
    // Form
    <form className='form-container'>
      <div className='form-container-box'>
        {/* Implementing form field entries- name and location */}
        {/* name */}
        <div className='form-field'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            placeholder='mock name'
            value={name}
            onChange={handleNameChange}
          />
          {nameError && <p className='error'>{nameError}</p>}
        </div>

        {/* location */}
        <div className='form-field'>
          <label htmlFor='location'>Location</label>
          <select
            id='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value='' disabled>
              Select location
            </option>
            {locationOptions.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Adding a group of buttons for Clear and Add */}
        <div className='buttons'>
          {/* Resets the form, info-table data and error message */}
          <button onClick={handleClear}>Clear</button>
          {/* Adds the form data to info-table */}
          <button onClick={handleAddInfo}>Add</button>
        </div>

        {/* Info-table maintains a record of entries. */}
        <table className='info-table'>
          {/* table head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>

          {/* table body */}
          <tbody>
            {/* info-table initially displays five empty rows for names and locations. 
            As new entries are added, it dynamically adjusts to accommodate and
            scale accordingly. */}
            {Array.from(
              { length: Math.max(5, tableData.length) },
              (_, index) => (
                <tr key={index}>
                  <td>{tableData[index]?.name || ""}</td>
                  <td>{tableData[index]?.location || ""}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default FormComponent;
