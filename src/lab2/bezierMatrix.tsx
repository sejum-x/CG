import React, { useRef, useState } from 'react';

interface Point {
    x: number;
    y: number;
}

const BezierCurveCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [info, setInfo] = useState<string>('');
    const [t, setT] = useState<number>(0.5);
    const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);


    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (selectedPointIndex !== null) {
            // Edit existing point
            const updatedPoints = [...points];
            updatedPoints[selectedPointIndex] = { x, y };
            setPoints(updatedPoints);
            setSelectedPointIndex(null);
        } else {
            // Add new point
            setPoints([...points, { x, y }]);
        }

        setInfo(`Clicked at (${x}, ${y})`);

        const ctx = canvas.getContext('2d');
        if (ctx && points.length > 0) {
            drawCharacteristicLines(ctx, [...points, { x, y }]);
        }
    };

    const handleEditPoint = (index: number) => {
        setSelectedPointIndex(index);
        setInfo(`Editing point ${index + 1}`);
        //drawCharacteristicLines(ctx, points);
    };

    const handleDeletePoint = (index: number) => {
        const updatedPoints = points.filter((_, i) => i !== index);
        setPoints(updatedPoints);
        setSelectedPointIndex(null);
        setInfo(`Deleted point ${index + 1}`);
        //drawCharacteristicLines(ctx, points);
    };

    const calculateBinomialCoefficient = (n: number, k: number): number => {
        let result = 1;
        for (let i = 1; i <= k; i++) {
            result *= (n - i + 1) / i;
        }
        return result;
    };

    const calculateBezierMatrix = (n: number, t: number): number[][] => {
        const matrix: number[][] = [];
        for (let i = 0; i <= n; i++) {
            matrix.push([]);
            for (let j = 0; j <= n; j++) {
                matrix[i].push(
                    calculateBinomialCoefficient(n, j) * Math.pow(1 - t, n - j) * Math.pow(t, j)
                );
                //console.log(matrix[i]);
            }
        }
        //console.log(matrix);
        return matrix;
    };

    const calculateBezierPoint = (controlPoints: Point[], t: number): Point => {
        const n = controlPoints.length - 1;
        const M = calculateBezierMatrix(n, t);

        console.log(M);

        let x = 0;
        let y = 0;

        for (let i = 0; i <= n; i++) {
            x += M[0][i] * controlPoints[i].x;
            y += M[0][i] * controlPoints[i].y;
        }
        //console.log(x, y);
        return { x, y };
    };

    const drawBezierCurve = (ctx: CanvasRenderingContext2D, bezierPoints: Point[]): void => {
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(bezierPoints[0].x, bezierPoints[0].y);
        for (let i = 1; i < bezierPoints.length; i++) {
            const { x, y } = bezierPoints[i];
            ctx.lineTo(x, y);
            //console.log(x, y);
        }
        ctx.stroke();
    };

    const drawCharacteristicLines = (ctx: CanvasRenderingContext2D, points: Point[]): void => {
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const { x, y } = points[i];
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    };

    const handleDrawCurve = () => {
        if (points.length < 2) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bezierPoints: Point[] = [];
        const steps = Math.floor(1 / t);
        for (let i = 0; i <= steps; i++) {
            const point = calculateBezierPoint(points, i * t);
            bezierPoints.push(point);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBezierCurve(ctx, bezierPoints);
        drawCharacteristicLines(ctx, points);
    };

    const handleClearCanvas = () => {
        setPoints([]);
        setInfo('');

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleTChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newT = parseFloat(event.target.value);
        setT(newT);
    };

    return (
        <div className="bezier-curve-editor">
            <h2>Bezier Curve Editor</h2>
            <div className="canvas-wrapper">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onClick={handleCanvasClick}
                ></canvas>
                <div className="info-box">
                    {info && <span>{info}</span>}
                </div>
            </div>
            <div className="controls">
                <label htmlFor="t">T Value:</label>
                <input
                    id="t"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={t}
                    onChange={handleTChange}
                />
                <button onClick={handleDrawCurve}>Draw Curve</button>
                <button onClick={handleClearCanvas}>Clear Canvas</button>
            </div>
            <ul className="point-list">
                {points.map((point, index) => (
                    <li key={index}>
                        {`Point ${index + 1}: (${point.x}, ${point.y})`}
                        <button onClick={() => handleEditPoint(index)}>Edit</button>
                        <button onClick={() => handleDeletePoint(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BezierCurveCanvas;
