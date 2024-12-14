import "./App.css";
import CalendarDiv from "./components/CalendarDiv";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="">
      <CalendarDiv />
      <Toaster />
    </div>
  );
}

export default App;
