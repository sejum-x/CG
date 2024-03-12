import React, { useState } from 'react';
import './style/TabMenu.css'
import Lab1 from "./lab1.tsx";
import Lab2 from "./lab2/lab2.tsx";
import Lab2_1 from "./lab2/lab2_1.tsx";
import Lab2_2 from './lab2/lab2_2.tsx';

const TabMenu: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const openTab = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <div className="tabandcontent">
            <aside className="tab">
                <button className={`tablinks ${activeTab === 'Dashboard' ? 'active' : ''}`}
                        onClick={() => openTab('Lab 1')}>Lab 1
                </button>
                <button className={`tablinks ${activeTab === 'Students' ? 'active' : ''}`}
                        onClick={() => openTab('Lab 2')}>Lab 2
                </button>
                <button className={`tablinks ${activeTab === 'Tasks' ? 'active' : ''}`}
                        onClick={() => openTab('Lab 3')}>Lab 3
                </button>
                <button className={`tablinks ${activeTab === 'Tasks' ? 'active' : ''}`}
                        onClick={() => openTab('Lab 4')}>Lab 4
                </button>
                <button className={`tablinks ${activeTab === 'Tasks' ? 'active' : ''}`}
                        onClick={() => openTab('Lab 5')}>Lab 5
                </button>
            </aside>

            <main className="tabcontent" style={{display: activeTab === 'Lab 1' ? 'flex' : 'none'}}>
                <Lab1/>
            </main>

            <main className="tabcontent" style={{display: activeTab === 'Lab 2' ? 'flex' : 'none'}}>
                <Lab2/>
            </main>

            <main className="tabcontent" style={{display: activeTab === 'Lab 3' ? 'flex' : 'none'}}>
                <Lab2_1/>
            </main>

            <main className="tabcontent" style={{display: activeTab === 'Lab 4' ? 'flex' : 'none'}}>
                <Lab2_2/>
            </main>
        </div>
    );
};

export default TabMenu;
