import React, { useEffect, useRef, useState } from 'react';

const BezierCurve = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [controlPoints, setControlPoints] = useState<{ x: number; y: number }[]>([
        { x: 0, y: 0 },
        { x: 100, y: 20 },
        { x: 20, y: 150 },
        { x: 400, y: 300 },
         { x: 200, y: 10 },
         { x: 20, y: 100 },
    ]);
    const [t, setT] = useState(0);
    const [newPointX, setNewPointX] = useState('');
    const [newPointY, setNewPointY] = useState('');

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Unable to get 2D context');
            return;
        }

        const calculateBinomialCoefficient = (n: number, k: number): number => {
            if (k < 0 || k > n) {
                return 0;
            }
            let result = 1;
            for (let i = 1; i <= k; i++) {
                result *= (n - i + 1) / i;
            }
            return Math.round(result);
        };
        function calculateBeizerMatrix(number: number): number[][] {
            const matrix: number[][] = Array.from({ length: number + 1 }, () => Array(number + 1).fill(0));
            for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
                for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex++) {
                    const sum = rowIndex + columnIndex;
                    if (sum <= number) {
                        const binominalCoef1 = calculateBinomialCoefficient(number, columnIndex);
                        const binominalCoef2 = calculateBinomialCoefficient(number - columnIndex, number - sum);
                        const powResult = Math.pow(-1.0, number - sum);
                        matrix[rowIndex][columnIndex] = binominalCoef1 * binominalCoef2 * powResult;
                    }
                }
            }

            console.log(matrix);
            return matrix;
        }

        const bezierMatrix = calculateBeizerMatrix(controlPoints.length - 1);

        function bezierCurve(t: number): { x: number; y: number } {
            let x = 0;
            for (let i = 0; i < controlPoints.length; i++) {
                let term = 0;
                for (let j = 0; j < controlPoints.length; j++) {
                    term += bezierMatrix[i][j] * controlPoints[j].x;
                }
                x += Math.pow(t, (controlPoints.length - 1) - i) * term;
            }

            let y = 0;
            for (let i = 0; i < controlPoints.length; i++) {
                let term = 0;
                for (let j = 0; j < controlPoints.length; j++) {
                    term += bezierMatrix[i][j] * controlPoints[j].y;
                }
                y += Math.pow(t, (controlPoints.length - 1) - i) * term;
            }

            return { x, y };
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(controlPoints[0].x, controlPoints[0].y);

        for (let t = 0; t <= 1; t += 0.01) {
            const point = bezierCurve(t);
            ctx.lineTo(point.x, point.y);
        }

        ctx.stroke();
    }, [controlPoints, t]);

    const addControlPoint = () => {
        const newX = parseFloat(newPointX);
        const newY = parseFloat(newPointY);
        if (!isNaN(newX) && !isNaN(newY)) {
            setControlPoints([...controlPoints, { x: newX, y: newY }]);
            setNewPointX('');
            setNewPointY('');
        }
    };

    const handleTChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setT(parseFloat(event.target.value));
    };

    const handleNewPointXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPointX(event.target.value);
    };

    const handleNewPointYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPointY(event.target.value);
    };

    return (
        <div>
            <canvas ref={canvasRef} width={400} height={300} />
            <div>
                <label>
                    X Coordinate:
                    <input type="text" value={newPointX} onChange={handleNewPointXChange} />
                </label>
                <label>
                    Y Coordinate:
                    <input type="text" value={newPointY} onChange={handleNewPointYChange} />
                </label>
                <button onClick={addControlPoint}>Add Control Point</button>
            </div>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={t}
                onChange={handleTChange}
            />
        </div>
    );
};

export default BezierCurve;
