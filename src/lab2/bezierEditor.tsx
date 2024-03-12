
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const BezierEditor: React.FC = () => {
    const [controlPoints, setControlPoints] = useState<{ x: number, y: number }[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [newPointX, setNewPointX] = useState('');
    const [newPointY, setNewPointY] = useState('');
    const [drawBezier, setDrawBezier] = useState(false); // Додано стейт для визначення чи малювати криву Безьє
    const [method, setMethod] = useState<'matrix' | 'recursive'>('matrix'); // Додано стейт для вибору методу малювання кривої Безьє
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const bezierPoints = useMemo(() => {
        const tStep = 0.01; 
        if (!drawBezier || controlPoints.length < 2) {
            return [];
        }

        const bezierPointsMatrix = computeBezierMatrixPoints(controlPoints, tStep);
        return bezierPointsMatrix.map(({ x, y }) => ({ x, y }));
    }, [controlPoints, drawBezier]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1, -1);

        if (drawBezier) {
            drawBezierMatrixCurve(ctx, bezierPoints);
            ctx.stroke();
        }

        //drawControlLine(ctx, controlPoints, 'red');

        ctx.restore();

        setShowTable(true);
    }, [controlPoints, drawBezier, bezierPoints]); // Додано drawBezier та method до залежностей useEffect

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - canvas.width / 2;
        const y = canvas.height / 2 - (event.clientY - rect.top);

        setControlPoints([...controlPoints, { x, y }]);
    };

    const handleNewPointSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const x = parseFloat(newPointX);
        const y = parseFloat(newPointY);
        if (!isNaN(x) && !isNaN(y)) {
            setControlPoints([...controlPoints, { x, y }]);
            setNewPointX('');
            setNewPointY('');
        }
    };

    const handleDrawBezierClick = () => {
        setDrawBezier(true); // Встановлюємо, що треба малювати криву Безьє
    };

    const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMethod(event.target.value as 'matrix' | 'recursive'); // Встановлюємо вибраний метод малювання
    };

    return (
        <div>
            <canvas ref={canvasRef} onClick={handleCanvasClick} width={800} height={600} style={{ border: '1px solid black' }} />
            <div>
                <h3>Enter new point:</h3>
                <form onSubmit={handleNewPointSubmit}>
                    <label>
                        X:
                        <input type="text" value={newPointX} onChange={(e) => setNewPointX(e.target.value)} />
                    </label>
                    <label>
                        Y:
                        <input type="text" value={newPointY} onChange={(e) => setNewPointY(e.target.value)} />
                    </label>
                    <button type="submit">Add Point</button>
                </form>
            </div>
            {showTable && (
                <div>
                    <h3>Control Points:</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Index</th>
                            <th>X</th>
                            <th>Y</th>
                        </tr>
                        </thead>
                        <tbody>
                        {controlPoints.map((point, index) => (
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{point.x}</td>
                                <td>{point.y}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div>
                <h3>Bezier Points:</h3>
                <ul>
                    {bezierPoints.map((point, index) => (
                        <li key={index}>{`(${point.x}, ${point.y})`}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Draw Bezier Curve:</h3>
                <button onClick={handleDrawBezierClick}>Draw Bezier Curve</button>
                <select value={method} onChange={handleMethodChange}>
                    <option value="matrix">Matrix</option>
                    <option value="recursive">Recursive</option>
                </select>
            </div>
        </div>
    );
};

function computeBezierCurve(controlPoints: { x: number, y: number }[], tStep: number): { x: number, y: number }[] {
    const n = controlPoints.length - 1;
    const points: { x: number, y: number }[] = [];

    for (let t = 0; t <= 1; t += tStep) {
        let x = 0;
        let y = 0;

        for (let i = 0; i <= n; i++) {
            const binomialCoefficient = binomial(n, i);
            const term = binomialCoefficient * Math.pow(1 - t, n - i) * Math.pow(t, i);
            x += term * controlPoints[i].x;
            y += term * controlPoints[i].y;
        }
        points.push({ x, y });
    }

    return points;
}
function drawBezierCurve(context: CanvasRenderingContext2D, points: { x: number, y: number }[], color: string) {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();
}
function binomial(n: number, k: number): number {
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - i + 1) / i;
    }
    return result;
}


function bezierMatrix(n: number, t: number): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i <= n; i++) {
        matrix.push([]);
        for (let j = 0; j <= n; j++) {
            matrix[i].push(binomial(n, j) * Math.pow(1 - t, n - j) * Math.pow(t, j));
        }
    }
    return matrix;
}
function computeBezierPointMatrix(controlPoints: { x: number, y: number }[], t: number): { x: number, y: number } {
    const n = controlPoints.length - 1;
    const M = bezierMatrix(n, t);

    let x = 0;
    let y = 0;

    for (let i = 0; i <= n; i++) {
        x += M[0][i] * controlPoints[i].x;
        y += M[0][i] * controlPoints[i].y;
    }
    return { x, y };
}

function computeBezierMatrixPoints(controlPoints, tStep) {
    const bezierPointsMatrix = [];
    for (let t = 0; t <= 1; t += tStep) {
        const point = computeBezierPointMatrix(controlPoints, t);
        bezierPointsMatrix.push(point);
    }
    return bezierPointsMatrix;
}

function drawBezierMatrixCurve(ctx, bezierPointsMatrix) {
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(bezierPointsMatrix[0].x, bezierPointsMatrix[0].y);
    for (let i = 1; i < bezierPointsMatrix.length; i++) {
        const { x, y } = bezierPointsMatrix[i];
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawControlLine(context: CanvasRenderingContext2D, points: { x: number, y: number }[], color: string) {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const { x, y } = points[i];
        context.lineTo(x, y);
    }
    context.stroke();
}
export default BezierEditor;

