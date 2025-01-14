import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Routes from './Routes';
import useUserStore from './states/userStore';

function App() {
  const [showBlur, setShowBlur] = useState(false);
  const { updateUser } = useUserStore();

  const openPopup = () => {
    setShowBlur(true);
  };

  const closePopup = () => {
    setShowBlur(false);
  };

  return (
    <div className="App">
      <Navbar setPopup={setShowBlur} />
      <div className={`${showBlur ? 'blur' : ''}`}>
        <Routes />
      </div>
    </div>
  );
}

export default App;
