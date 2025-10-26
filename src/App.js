import React,{useEffect} from 'react';
import './App.css';

import { SettingsProvider } from './context/SettingsProvider.jsx';
import { LessonStateProvider } from './context/LessonStateProvider.jsx';
import { ActiveLessonProvider } from './context/ActiveLessonProvider.jsx';
import Main from './Main.js';

function App() {
    useEffect(() => {
        document.body.style.overflow = "hidden";
    }, []);

    return (
        <div className="App">
            <SettingsProvider>
                <LessonStateProvider>
                    <ActiveLessonProvider>
                        <Main/>
                    </ActiveLessonProvider>
                </LessonStateProvider>
            </SettingsProvider>
        </div>
    );
}

export default App;
