import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "./abi.json";

const contractAddress = "0x3f16196Be83233be0cda80d3FB749156505126C2";

export default function SchoolManagement() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setWalletAddress(address);
    return new ethers.Contract(contractAddress, contractABI, signer);
  }

  async function disconnectWallet() {
    setWalletAddress("");
    setStudents([]);
  }

  async function fetchAllStudents() {
    const contract = await connectWallet();
    const ids = await contract.getAllStudents();
  
    const studentData = await Promise.all(
      ids.map(async (id) => {
        try {
          const [name, isRegistered] = await contract.getStudent(id);
  
          if (!isRegistered) {
            console.warn(`Student ID ${id} is not registered.`);
            return null;
          }
  
          return { id: id.toString(), name };
        } catch (error) {
          console.error(`Error fetching student ${id}:`, error);
          return null; // Skip students that cause errors
        }
      })
    );
  
    setStudents(studentData.filter((s) => s !== null));
  }
  

  async function registerStudent() {
    if (!studentId || !studentName) return alert("Enter valid ID and Name");
    const contract = await connectWallet();
    await contract.registerStudent(parseInt(studentId), studentName);
    fetchAllStudents();
  }

  async function removeStudent(id) {
  const contract = await connectWallet();

  try {
    const [name, isRegistered] = await contract.getStudent(id);

    if (!isRegistered) {
      alert(`Student ID ${id} does not exist.`);
      return;
    }

    await contract.removeStudent(id);
    fetchAllStudents();
  } catch (error) {
    console.error(`Error removing student ${id}:`, error);
    alert("Failed to remove student. Please check if the student exists.");
  }
}


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
     
      <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-4">
        {walletAddress ? (
          <>
            <p className="text-gray-700 font-semibold">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>

      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">School Management</h1>

        
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Student ID"
            className="border p-2 w-full rounded-lg"
            onChange={(e) => setStudentId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Student Name"
            className="border p-2 w-full rounded-lg"
            onChange={(e) => setStudentName(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600 transition"
            onClick={registerStudent}
          >
            Register Student
          </button>
        </div>

       
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition"
          onClick={fetchAllStudents}
        >
          Load Students
        </button>

       
        <ul className="list-none space-y-2">
          {students.map((student) => (
            <li key={student.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="text-gray-700 font-medium">{student.id}: {student.name}</span>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                onClick={() => removeStudent(student.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
