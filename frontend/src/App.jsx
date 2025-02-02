import Tables from "./components/Tables/Tables";
import SignIn from "./components/SignIn/SignIn";
import {Route, Routes} from "react-router-dom";
import { TablesXlsx } from "./components/XLSX/TablesXlsx";
import  Logs  from "./components/MyLogs/Logs"
import Stats from "./components/Tables/Stats";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<SignIn />}/>
        <Route path={"/tables"} element={<Tables />}/>
        <Route path={"/logs"} element={<Logs />}/>
        <Route path="/xlsx/:id" element={<TablesXlsx />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </div>
  );
}