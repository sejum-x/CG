import Canvaslab1 from "./canvaslab1.tsx";
import Table from "./lineTable.tsx";
import InputForm from "./inputPointsForm.tsx";
import './style/lab1.css'
import { useState } from 'react';

function Lab1() {
    const [lines, setLines] = useState([
        { A: { x: 10, y: 20 }, B: { x: 100, y: 20 },innerColor: 'red', fillColor: 'blue' },
    ]);

    interface Point {
        x: number;
        y: number;
    }
    interface Line {
        A: Point;
        B: Point;
        innerColor: string;
        fillColor: string;
    }

    const handleAddLine = (newLine: Line) => {
        setLines(prevLines => [...prevLines, newLine]);
    };

    return (
        <div className="container">
            <div className="canvas">
                <Canvaslab1 lines={lines} />
            </div>
            <div className="infotable">
                <Table lines={lines} />
            </div>
            <div className="inputInfo">
                <InputForm onAddLine={handleAddLine} />
            </div>
        </div>
    );
}

export default Lab1;
