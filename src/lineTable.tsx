import React from 'react';
import './style/lineTable.css';

interface Line {
    A: { x: number, y: number },
    B: { x: number, y: number },
    innerColor: string,
    fillColor: string
}

interface TableProps {
    lines: Line[]
}

const Table: React.FC<TableProps> = ({ lines }) => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>Point A</th>
                <th>Point B</th>
                <th>Color</th>
                <th>Fill Color</th>
            </tr>
            </thead>
            <tbody>
            {lines.map((line, index) => (
                <tr key={index}>
                    <td>({line.A.x}, {line.A.y})</td>
                    <td>({line.B.x}, {line.B.y})</td>
                    <td>
                        <div className="color-box" style={{ backgroundColor: line.innerColor }}></div>
                        {line.innerColor}
                    </td>
                    <td>
                        <div className="color-box" style={{ backgroundColor: line.fillColor }}></div>
                        {line.fillColor}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table;
