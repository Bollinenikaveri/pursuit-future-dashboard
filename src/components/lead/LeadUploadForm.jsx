import React, { useRef, useState, useEffect } from "react";
import { FaFileCsv } from "react-icons/fa6";

export default function AssignLeads({ token = "", role = "Admin" }) {
  const [leadType, setLeadType] = useState("Sales Lead");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  // Fetch employees safely
  useEffect(() => {
  if (role === "Admin") {
    fetch("http://localhost:3000/lead/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch(() =>
        setEmployees([
          { _id: "1", empname: "John Doe", email: "john@example.com" },
          { _id: "2", empname: "Jane Doe", email: "jane@example.com" },
        ])
      );
  }
}, [role, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedEmployee) {
      setMessage("⚠️ Please select an employee and upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("employeeId", selectedEmployee);
    formData.append("leadType", leadType);

    try {
      const res = await fetch("http://localhost:3000/lead/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message} (${data.count} leads)`);
        setFile(null);
        setSelectedEmployee("");
      } else {
        setMessage(`❌ ${data.error || "Upload failed"}`);
      }
    } catch {
      setMessage("❌ Failed to upload leads");
    }
  };

  if (role !== "Admin")
    return <p className="p-4 text-red-600">Only Admin can access this page</p>;

  return (
    <div className="p-4 m-6 w-96 border-[#004AAD] rounded-md border bg-white shadow-md">
      <h1 className="text-lg font-bold mb-4">Assign Leads to Members</h1>

      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lead Type */}
        <div>
          <label className="block mb-1 font-medium">Lead Type</label>
          <select
            value={leadType}
            onChange={(e) => setLeadType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option>Sales Lead</option>
            <option>Gen Lead</option>
          </select>
        </div>

        {/* Employee Selection */}
        <div>
          <label className="block mb-1 font-medium">Assign To Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">-- Select Employee --</option>
            {Array.isArray(employees) &&
  employees.map(emp => (
    <option key={emp._id} value={emp._id}>
      {emp.empname} ({emp.email})
    </option>
  ))
}

          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-1 font-medium">CSV File</label>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-full flex justify-center items-center gap-2 border-2 border-[#004AAD] bg-[#004AAD] text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaFileCsv />
            {file ? `Selected: ${file.name}` : "Choose CSV File"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Assign Leads
        </button>
      </form>
    </div>
  );
}
