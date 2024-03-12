import React, { useEffect, useRef, useState } from "react";
import "./style/canvasLab1.css";

interface Point {
    x: number;
    y: number;
}

function findDAndCPoints(start: Point, end: Point): { D: Point; C: Point } {

    let xAB, yAB;

    if(start.x < end.x){
        xAB = -1 * (end.y - start.y);
        yAB = (end.x - start.x);
    } else{
        xAB = (end.y - start.y);
        yAB = -1 * (end.x - start.x);
    }

    const xd = start.x - xAB;
    const yd = start.y - yAB;

    const xc = end.x - xAB;
    const yc = end.y - yAB;

    return {
        D: { x: xd, y: yd },
        C: { x: xc, y: yc },
    };
}

function drawGrid(ctx: CanvasRenderingContext2D, gridSize: number, gridColor: string) {
    ctx.beginPath();
    for (let x = -7000; x <= 7000; x += gridSize) {
        ctx.moveTo(x, -7000);
        ctx.lineTo(x, 7000);
    }
    for (let y = -7000; y <= 7000; y += gridSize) {
        ctx.moveTo(-7000, y);
        ctx.lineTo(7000, y);
    }
    ctx.strokeStyle = gridColor;
    ctx.stroke();
}

function findMidpoints(p1: Point, p2: Point, p3: Point, p4: Point): Point[] {
    const midpoints: Point[] = [];
    midpoints.push({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });
    midpoints.push({ x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 });
    midpoints.push({ x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2 });
    midpoints.push({ x: (p4.x + p1.x) / 2, y: (p4.y + p1.y) / 2 });
    return midpoints;
}

interface Line {
    A: Point;
    B: Point;
    innerColor: string;
    fillColor: string;
}

interface CanvasLab1Props {
    lines: Line[];
}

const gridSizes = [5, 10, 20, 40, 50, 70, 100, 140, 200];

export default function Canvaslab1({ lines }: CanvasLab1Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState<number>(1);
    const [gridSize, setGridSize] = useState<number>(100); // Додано стейт для розміру сітки
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<Point | null>(null);
    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (ctx && canvas) {
            canvas.width = 600;
            canvas.height = 600;
            ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
            ctx.scale(scale, -scale); // Reverse the y-axis and apply scale

            // Draw Cartesian coordinate system
            ctx.beginPath();
            ctx.moveTo(-7000, 0);
            ctx.lineTo(7000, 0);
            ctx.moveTo(0, -7000);
            ctx.lineTo(0, 7000);
            ctx.strokeStyle = "black";
            ctx.stroke();

            // Draw grid
            drawGrid(ctx, gridSize, "rgba(0, 0, 0, 0.1)");

            // Draw each line
            lines.forEach((line) => {
                const { D, C } = findDAndCPoints(line.A, line.B);
                const midpoints = findMidpoints(line.A, line.B, C, D);

                ctx.beginPath();
                ctx.moveTo(line.A.x, line.A.y);
                ctx.lineTo(D.x, D.y);
                ctx.lineTo(C.x, C.y);
                ctx.lineTo(line.B.x, line.B.y);
                ctx.closePath(); // Close the path
                ctx.fillStyle = line.fillColor; // Set fill color
                ctx.fill(); // Fill the shape
                ctx.strokeStyle = "black"; // Set stroke color
                ctx.stroke(); // Draw the stroke

                // Draw inner squares
                ctx.beginPath();
                ctx.moveTo(midpoints[0].x, midpoints[0].y);
                ctx.lineTo(midpoints[1].x, midpoints[1].y);
                ctx.lineTo(midpoints[2].x, midpoints[2].y);
                ctx.lineTo(midpoints[3].x, midpoints[3].y);
                ctx.closePath();
                ctx.fillStyle = line.innerColor;
                ctx.fill(); // Fill the shape
                ctx.strokeStyle = "black"; // Set stroke color
                ctx.stroke(); // Draw the stroke
            });
        }
    }, [lines, scale, offset, gridSize]);

    const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newScale = Number(e.target.value);
        setScale(newScale);
    };

    const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newGridSize = Number(e.target.value);
        if (gridSizes.includes(newGridSize)) {
            setGridSize(newGridSize);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (isDragging && dragStart) {
            const newOffset = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
            setOffset({ x: offset.x + newOffset.x, y: offset.y + newOffset.y });
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                id="canvasLab1"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            ></canvas>
            <label htmlFor="scale">Масштаб: {scale}</label>
            <input
                id="scale"
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
            />
            <label htmlFor="gridSize">Розмір сітки: {gridSize}</label>
            <input
                id="gridSize"
                type="range"
                min="5"
                max="200"
                step="5"
                value={gridSize}
                onChange={handleGridSizeChange}
            />

        </div>
    );
}
