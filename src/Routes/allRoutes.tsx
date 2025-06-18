import { Navigate } from "react-router-dom";
import CounterpartieEdit from "../pages/References/Counterparties/CounterpartieEdit";
import CounterpartiesList from "../pages/References/Counterparties/CounterpartiesList";
import BanksList from "../pages/References/Banks/BanksList";
import BankEdit from "../pages/References/Banks/BankEdit";
import PlantingMaterialsList from "../pages/References/PlantingMaterials/PlantingMaterialsList";
import PlantingMaterialEdit from "../pages/References/PlantingMaterials/PlantingMaterialEdit";
import StorageLocationsList from "../pages/References/StorageLocations/StorageLocationsList";
import StorageLocationEdit from "../pages/References/StorageLocations/StorageLocationEdit";
import PesticidesList from "../pages/References/Pesticides/PesticidesList";
import PesticideEdit from "../pages/References/Pesticides/PesticideEdit";

import HarvestedProductsList from '../pages/Inventory/HarvestedProducts/HarvestedProductsList';
import HarvestedProductEdit from '../pages/Inventory/HarvestedProducts/HarvestedProductEdit';
import EquipmentsList from '../pages/Assets/Equipment/EquipmentsList';
import EquipmentEdit from '../pages/Assets/Equipment/EquipmentEdit';
import FieldsList from '../pages/Assets/Fields/FieldsList';
import FieldEdit from '../pages/Assets/Fields/FieldEdit';
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
  { path: "/references/banks", 
    component: <BanksList /> 
  },
{
  path: "/references/banks/edit/:id",
  component: <BankEdit/>,
},
{
  path: "/references/banks/edit/new", 
  component: <BankEdit/>,
},
{ path: "/references/planting-materials", 
 component: <PlantingMaterialsList /> 
},
{
path: "/references/planting-materials/edit/:id",
component: <PlantingMaterialEdit/>,
},
{
path: "/references/planting-materials/edit/new", 
component: <PlantingMaterialEdit/>,
},

{ path: "/references/storage-locations", 
  component: <StorageLocationsList /> 
},
{
path: "/references/storage-locations/edit/:id",
component: <StorageLocationEdit/>,
},
{
path: "/references/storage-locations/edit/new", 
component: <StorageLocationEdit/>,
},


{ path: "/references/pesticides", 
  component: <PesticidesList /> 
},
{
path: "/references/pesticides/edit/:id",
component: <PesticideEdit/>,
},
{
path: "/references/pesticides/edit/new", 
component: <PesticideEdit/>,
},

{ 
  path: "/inventory/harvested-products", 
  component: <HarvestedProductsList /> 
},
{
  path: "/inventory/harvested-products/edit/:id",
  component: <HarvestedProductEdit/>,
},
{
  path: "/inventory/harvested-products/edit/new", 
  component: <HarvestedProductEdit/>,
},
{ 
  path: "/assets/equipment", 
  component: <EquipmentsList /> 
},
{
  path: "/assets/equipment/edit/:id",
  component: <EquipmentEdit/>,
},
{
  path: "/assets/equipment/edit/new", 
  component: <EquipmentEdit/>,
},
{
  path: "/assets/fields",
  component: <FieldsList />
},
{
  path: "/assets/fields/edit/:id",
  component: <FieldEdit/>,
},
{
  path: "/assets/fields/edit/new",
  component: <FieldEdit/>,
},
  //Tables
  { path: "/tables-basic", component: <BasicTables /> },
  { path: "/tables-react", component: <ReactTable /> },
  //Sync
  { path: "/sync-test", component: <SyncTest /> },
];

export { authProtectedRoutes, publicRoutes };