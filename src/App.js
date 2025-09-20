import React,{useEffect} from 'react';
import './App.css';

import MainPage from './MainPage.js';
import { SettingsProvider } from './context/SettingsProvider.jsx';

function App() {
    useEffect(() => {
        document.body.style.overflow = "hidden";
    }, []);

    return (
        <div className="App">
            <SettingsProvider>
                <MainPage />
            </SettingsProvider>
        </div>
    );
}

export default App;
