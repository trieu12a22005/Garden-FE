import { Route, Routes } from 'react-router-dom';
import Login from 'pages/login/Login';
import MainLayout from 'components/layouts/MainLayout';
import Portfolio from 'pages/portfolio';
import RoleHome from './pages/RoleHome/RoleHome';
import Examination from './pages/Examination/ExaminationForm';
import Timetable from './pages/TimeTable';
import PharmacyQueue from './pages/PharmacyQueue';
import PrescriptionDetail from './pages/PharmacyQueue/PrescriptionDetail';
import PharmacyInventory from './pages/PharmacyInventory';
import GlobalLoading from './components/GlobalLoading';
import Prescription from './pages/Prescription/index';
// import './App.css';
function App() {
  return (
    <>
    <GlobalLoading />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route index element={<Portfolio />}></Route>
          <Route path = "/role_home" element = {<RoleHome />} />
          <Route path='/timetable' element = {<Timetable/>} />
          <Route path='/examination' element = {<Examination/>} />
          <Route path='/pharmacy-queue' element={<PharmacyQueue />} />
          <Route path='/pharmacy-queue/:prescriptionId' element={<PrescriptionDetail />} />
          <Route path='/pharmacy-inventory' element={<PharmacyInventory />} />
          <Route path='/prescription' element = {<Prescription/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
