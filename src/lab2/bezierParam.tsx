import { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DragTypes = {
    CONTROL_POINT: 'controlPoint',
};

const BezierParam = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [controlPoints, setControlPoints] = useState<{ x: number; y: number }[]>([]);
    const [bezierParamPoints] = useState<{ x: number; y: number }[]>([]);
    const [bezierMatrixPoints] = useState<{ x: number; y: number }[]>([]);
    //const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
    const [selectedMethod, setSelectedMethod] = useState('Param');

    const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMethod(event.target.value);
    };

    const movePoint = (dragIndex: number, hoverIndex: number) => {
        const dragPoint = controlPoints[dragIndex];
        setControlPoints((prevControlPoints) => {
            const newControlPoints = [...prevControlPoints];
            newControlPoints.splice(dragIndex, 1);
            newControlPoints.splice(hoverIndex, 0, dragPoint);
            return newControlPoints;
        });
    };



    const DraggablePoint: React.FC<{ index: number }> = ({ index }) => {
    const [{ isDragging }, drag] = useDrag({
        type: DragTypes.CONTROL_POINT,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: DragTypes.CONTROL_POINT,
        hover: (item: { index: number }, monitor) => {
            if (!canvasRef.current || !monitor.isOver({ shallow: true })) {
                return;
            }
            const hoverIndex = index;
            if (item.index === hoverIndex) {
                return;
            }
            movePoint(item.index, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [x, setX] = useState(controlPoints[index].x);
    const [y, setY] = useState(controlPoints[index].y);

        const handleDelete = () => {
            setControlPoints(prevControlPoints => {
                const newControlPoints = [...prevControlPoints];
                newControlPoints.splice(index, 1);
                return newControlPoints;
            });
        };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setControlPoints(prevControlPoints => {
            const newControlPoints = [...prevControlPoints];
            newControlPoints[index] = { x, y };
            return newControlPoints;
        });
        setIsEditing(false);
    };

    const style: React.CSSProperties = {
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
    };

        return (
            <tr ref={(node) => drag(drop(node))} style={style}>
                <td>{index}</td>
                <td>
                    {isEditing ? <input type="number" value={x} onChange={e => setX(Number(e.target.value))} /> : x}
                </td>
                <td>
                    {isEditing ? <input type="number" value={y} onChange={e => setY(Number(e.target.value))} /> : y}
                </td>
                <td>
                    {isEditing ? (
                        <button onClick={handleSave}>Save</button>
                    ) : (
                        <>
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </>
                    )}
                </td>
            </tr>
        );
    };





    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Unable to get 2D context');
            return;
        }

        canvas.width = 600;
        canvas.height = 600;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1, -1);

        const drawGridAndAxis = () => {
            const gridSize = 20; // Define the size of the grid squares

            // Draw the grid lines
            ctx.strokeStyle = '#ddd'; // Light grey for the grid lines
            for (let i = -canvas.width / 2; i <= canvas.width / 2; i += gridSize) {
                ctx.beginPath();
                ctx.moveTo(i, -canvas.height / 2);
                ctx.lineTo(i, canvas.height / 2);
                ctx.stroke();
            }
            for (let i = -canvas.height / 2; i <= canvas.height / 2; i += gridSize) {
                ctx.beginPath();
                ctx.moveTo(-canvas.width / 2, i);
                ctx.lineTo(canvas.width / 2, i);
                ctx.stroke();
            }

            // Draw the coordinate axis
            ctx.strokeStyle = '#000'; // Black for the coordinate axis
            ctx.lineWidth = 2; // Make the axis a bit thicker
            ctx.beginPath();
            ctx.moveTo(-canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, 0);
            ctx.moveTo(0, -canvas.height / 2);
            ctx.lineTo(0, canvas.height / 2);
            ctx.stroke();

            ctx.lineWidth = 1; // Reset the line width to 1
        };

        drawGridAndAxis();




        const calculateBinomialCoefficient = (n: number, k: number): number => {
            if (k < 0 || k > n) {
                return 0;
            }
            let result = 1;
            for (let i = 1; i <= k; i++) {
                result *= (n - i + 1) / i;
            }
            return result;
        };

        const calculateBernsteinPolynomial = (n: number, i: number, t: number): number => {
            const binomialCoefficient = calculateBinomialCoefficient(n, i);
            return binomialCoefficient * Math.pow(t, i) * Math.pow(1 - t, n - i);
        };

        const calculatePoint = (t: number, n: number): { x: number; y: number } => {
            let x = 0;
            for (let i = 0; i < controlPoints.length; i++) {
                x += controlPoints[i].x * calculateBernsteinPolynomial(n, i, t);
            }
            let y = 0;
            for (let i = 0; i < controlPoints.length; i++) {
                y += controlPoints[i].y * calculateBernsteinPolynomial(n, i, t);
            }

            return { x, y };
        };

        const calculateBezierCurve = (tStep: number) => {
            bezierParamPoints.length = 0;
            let t = 0;
            for (; t < 1; t += tStep) {
                if (t > 1) {
                    t = 1;
                }
                const point = calculatePoint(t, controlPoints.length - 1);
                bezierParamPoints.push(point);
            }
            const point = calculatePoint(1, controlPoints.length - 1);
            bezierParamPoints.push(point);
        };

        //matrix
        const calculateBeizerMatrix = (number: number): number[][] => {
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
            return matrix;
        };

        const calculateBezierMatrixPoint = (t: number, bezierMatrix: number[][]): { x: number; y: number } => {
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

        const calculateBezierMatrixCurve = (tStep: number, bezierMatrix: number[][]) => {
            bezierMatrixPoints.length = 0;
            let t = 0;
            for (; t < 1; t += tStep) {
                if (t > 1) {
                    t = 1;
                }
                const point = calculateBezierMatrixPoint(t, bezierMatrix);
                bezierMatrixPoints.push(point);
            }
            const point = calculateBezierMatrixPoint(1, bezierMatrix);
            bezierMatrixPoints.push(point);
        };

        const drawBezierCurve = (points: { x: number; y: number }[]) => {
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        };

        const handleCanvasClick = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            setControlPoints([...controlPoints, { x: mouseX - canvas.width / 2, y: canvas.height / 2 - mouseY }]);
        };

        canvas.addEventListener('click', handleCanvasClick);

        if (selectedMethod === 'Param') {
            calculateBezierCurve(0.01);
            drawBezierCurve(bezierParamPoints);
        } else if (selectedMethod === 'Matrix') {
            console.log('Matrix');
            const bezierMatrix = calculateBeizerMatrix(controlPoints.length - 1);
            calculateBezierMatrixCurve(0.01, bezierMatrix);
            drawBezierCurve(bezierMatrixPoints);
        }

        return () => {
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, [controlPoints, bezierParamPoints, selectedMethod]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <canvas ref={canvasRef} />
                <div>
                    <label>
                        <input type="radio" value="Param" checked={selectedMethod === 'Param'} onChange={handleMethodChange} />
                        Param
                    </label>
                    <label>
                        <input type="radio" value="Matrix" checked={selectedMethod === 'Matrix'} onChange={handleMethodChange} />
                        Matrix
                    </label>
                </div>
                <table style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                    <tr>
                        <th>Point</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {controlPoints.map((_, index) => (
                        <DraggablePoint key={index} index={index} />
                    ))}
                    </tbody>
                </table>
            </div>
        </DndProvider>
    );
};

export default BezierParam;
