import "./App.css";
import CalendarDiv from "./components/CalendarDiv";
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="">
      <CalendarDiv />
      <ToastContainer/>
    </div>
  );
}

export default App;
