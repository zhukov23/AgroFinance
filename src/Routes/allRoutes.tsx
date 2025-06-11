import { Navigate } from "react-router-dom";
import CounterpartieEdit from "../pages/References/Counterparties/CounterpartieEdit";
import CounterpartiesList from "../pages/References/Counterparties/CounterpartiesList";
import BanksList from "../pages/References/Banks/BanksList";
// import EquipmentList from "../pages/Assets/Equipment/EquipmentList";
import EquipmentEdit from "../pages/Assets/Equipment/EquipmentEdit";
import BankEdit from "../pages/References/Banks/BankEdit";
import SyncTest from "../pages/SyncTest/SyncTest";

//Dashboard
import DashboardAnalytics from "../pages/DashboardAnalytics";
// import DashboardCrm from "../pages/DashboardCrm";
// import DashboardEcommerce from "../pages/DashboardEcommerce";
// import DashboardJobs from '../pages/Dashboardjob';

//Tables
import BasicTables from '../pages/Tables/BasicTables/BasicTables';
import ReactTable from "../pages/Tables/ReactTables";

// Публичные роуты (без авторизации)
const publicRoutes: any = [
  // Пока пустой массив
];

// Защищенные роуты (с сайдбаром)
const authProtectedRoutes = [
  { path: "/", component: <Navigate to="/dashboard-analytics" /> },
  { path: "/dashboard-analytics", component: <DashboardAnalytics /> },
  // Справочники 
  { path: "/references/counterparties", component: <CounterpartiesList /> },
  { path: "/references/counterpartieEdit", component: <CounterpartieEdit /> },
{
  path: "/references/counterparties/edit/:id",
  component: <CounterpartieEdit/>,
},
{
  path: "/references/counterparties/edit/new", 
  component: <CounterpartieEdit/>,
},
  { path: "/references/banks", component: <BanksList /> },
  // { path: "/references/bankEdit", component: <BankEdit /> },
{
  path: "/references/banks/edit/:id",
  component: <BankEdit/>,
},
{
  path: "/references/banks/edit/new", 
  component: <BankEdit/>,
},
  //Tables
  { path: "/tables-basic", component: <BasicTables /> },
  { path: "/tables-react", component: <ReactTable /> },
  //Активы
  // { path: "/assets/equipment", component: <EquipmentList /> },
  { path: "/assets/equipmentEdit", component: <EquipmentEdit /> },
  //Sync
  { path: "/sync-test", component: <SyncTest /> },
];

export { authProtectedRoutes, publicRoutes };