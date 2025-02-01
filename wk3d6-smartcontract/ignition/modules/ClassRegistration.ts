// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const ClassRegistrationModule = buildModule("ClassRegistrationModule", (m) => {


  const classReg = m.contract("ClassRegistration");

  return { classReg };
});

export default ClassRegistrationModule;
