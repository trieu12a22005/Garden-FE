import { Route, Routes } from 'react-router-dom';
import Login from 'pages/login/Login';
import MainLayout from 'components/layouts/MainLayout';
import Portfolio from 'pages/portfolio';
import RoleHome from './pages/RoleHome/RoleHome';
import Timetable from './pages/TimeTable';
import GlobalLoading from './components/GlobalLoading';
import Prescription from './pages/Prescription/index';
import WaitingRoomPage from './pages/WaitingRoom';
import PatientHistory from './pages/PatientHistory/index';
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
          <Route path='/waiting-room' element = {<WaitingRoomPage/>} />
          <Route path='/prescription/:id' element = {<Prescription/>} />
          <Route path='/patient-history/:id' element = {<PatientHistory/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
