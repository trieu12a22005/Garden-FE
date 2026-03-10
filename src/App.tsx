import { Route, Routes } from 'react-router-dom';
import Login from 'pages/login/Login';
import MainLayout from 'components/layouts/MainLayout';
import Portfolio from 'pages/portfolio';
import RoleHome from './pages/RoleHome/RoleHome';
import TimeTable from './pages/TimeTable/TimeTable';
import Examination from './pages/Examination/ExaminationForm';

// import './App.css';
function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route index element={<Portfolio />}></Route>
          <Route path = "/role_home" element = {<RoleHome />} />
          <Route path='/timetable' element = {<TimeTable/>} />
          <Route path='/examination' element = {<Examination/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
