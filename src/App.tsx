import { Route, Routes } from "react-router-dom";
import Login from "pages/login/Login";
import MainLayout from "components/layouts/MainLayout";
import Portfolio from "pages/portfolio";
import RoleHome from "./pages/RoleHome/RoleHome";
import Timetable from "./pages/TimeTable";
import PharmacyQueue from "./pages/PharmacyQueue";
import PrescriptionDetail from "./pages/PharmacyQueue/PrescriptionDetail";
import PharmacyInventory from "./pages/PharmacyInventory";
import GlobalLoading from "./components/GlobalLoading";
import Prescription from "./pages/Prescription/index";
import WaitingRoomPage from "./pages/WaitingRoom";
import PatientHistory from "./pages/PatientHistory/index";
import Profile from "./pages/Profile/Profile";
import RoleDashboardPage from "./pages/Role/RoleDashboard";
import RoleLayout from "./pages/Role/layout";
import EditRolePage from "./pages/Role/EditRole";
import EditRoleLayout from "./pages/Role/EditRole/Layout";
// import './App.css';
function App() {
  return (
    <>
      <GlobalLoading />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route index element={<Portfolio />}></Route>
          <Route path="/role_home" element={<RoleHome />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/waiting-room" element={<WaitingRoomPage />} />
          <Route path="/prescription/:id" element={<Prescription />} />
          <Route path="/patient-history/:id" element={<PatientHistory />} />
          {/* <Route path='/examination' element = {<Examination/>} /> */}
          <Route path="/pharmacy-queue" element={<PharmacyQueue />} />
          <Route path="/pharmacy-queue/:prescriptionId" element={<PrescriptionDetail />} />
          <Route path="/pharmacy-inventory" element={<PharmacyInventory />} />
          <Route path="/prescription" element={<Prescription />} />

          {/* role management */}
          <Route path="/role" element={<RoleLayout />}>
            <Route index element={<RoleDashboardPage />} />
            <Route path="details" element={<EditRoleLayout />}>
              <Route index element={<b>Bấm vào vai trò bất kỳ ở danh sách bên trái</b>} />
              <Route path="new" element={<EditRolePage mode="new" />} />
              <Route path=":id" element={<EditRolePage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
