import Tables from "./components/Tables/Tables";
import SignIn from "./components/SignIn/SignIn";
import {Route, Routes} from "react-router-dom";
import { TablesXlsx } from "./components/XLSX/TablesXlsx";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<SignIn />}/>
        <Route path={"/tables"} element={<Tables />}/>
        <Route path={"/xlsx"} element={<TablesXlsx />}/>
      </Routes>
    </div>
  );
}