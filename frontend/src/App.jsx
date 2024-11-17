import Tables from "./components/Tables/Tables";
import SignIn from "./components/SignIn/SignIn";
import {Route, Routes} from "react-router-dom";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<SignIn />}/>
        <Route path={"/tables"} element={<Tables />}/>
      </Routes>
    </div>
  );
}