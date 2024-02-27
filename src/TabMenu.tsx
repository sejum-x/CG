import React, { useState } from 'react';
import './style/TabMenu.css'
import Lab1 from "./lab1.tsx";

const TabMenu: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const openTab = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <div className="tabandcontent" >
            <aside className="tab">
                <button className={`tablinks ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => openTab('Lab 1')}>Lab 1</button>
                <button className={`tablinks ${activeTab === 'Students' ? 'active' : ''}`} onClick={() => openTab('Lab 2')}>Lab 2</button>
                <button className={`tablinks ${activeTab === 'Tasks' ? 'active' : ''}`} onClick={() => openTab('Lab 3')}>Lab 3</button>
                <button className={`tablinks ${activeTab === 'Tasks' ? 'active' : ''}`} onClick={() => openTab('Lab 4')}>Lab 4</button>
                <button className={`tablinks ${activeTab === 'Tasks' ? 'active' : ''}`} onClick={() => openTab('Lab 5')}>Lab 5</button>
            </aside>

            <main className="tabcontent" style={{ display: activeTab === 'Lab 1' ? 'flex' : 'none' }}>
                 <Lab1/>
            </main>

            <main className="tabcontent" style={{ display: activeTab === 'Lab 2' ? 'flex' : 'none' }}>
                <h3>Students</h3>
                <p>Students content</p>
            </main>

            <main className="tabcontent" style={{ display: activeTab === 'Lab 3' ? 'flex' : 'none' }}>
                <h3>Tasks</h3>
                <p>Tasks content</p>
            </main>
        </div>
    );
};

export default TabMenu;
