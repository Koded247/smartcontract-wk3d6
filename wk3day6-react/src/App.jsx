

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = "0x3f16196Be83233be0cda80d3FB749156505126C2";

export default function ClassRegistration() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      const signer = web3Provider.getSigner();
      const classContract = new ethers.Contract(contractAddress, abi, signer);
      setContract(classContract);
      fetchStudents(classContract);
    }
  }, []);

  const fetchStudents = async (contract) => {
    try {
      const ids = await contract.getAllStudents();
      const studentData = await Promise.all(
        ids.map(async (id) => {
          const student = await contract.getStudent(id);
          return { id: id.toString(), name: student.name };
        })
      );
      setStudents(studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const registerStudent = async () => {
    if (!contract || !studentId || !studentName) return;
    try {
      const tx = await contract.registerStudent(studentId, studentName);
      await tx.wait();
      fetchStudents(contract);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const removeStudent = async (id) => {
    if (!contract) return;
    try {
      const tx = await contract.removeStudent(id);
      await tx.wait();
      fetchStudents(contract);
    } catch (error) {
      console.error("Removal failed:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">Class Registration</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Student ID"
          className="border p-2 rounded w-1/3"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student Name"
          className="border p-2 rounded w-1/3"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          
        />
        <button
          onClick={registerStudent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-3">Registered Students</h2>
      <ul>
        {students.map((student) => (
          <li
            key={student.id}
            className="flex justify-between p-2 border-b"
          >
            <span>{student.name} (ID: {student.id})</span>
            <button
              onClick={() => removeStudent(student.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
