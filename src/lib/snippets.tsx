import React from "react";

type IQRData = {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
};

type IQRBoxPlotProps = {
    data: IQRData;
};

export const IQRBoxPlot: React.FC<IQRBoxPlotProps> = ({data}) => {
    const {min, q1, median, q3, max} = data;

    const scale = (value: number): number =>
        ((value - min) / (max - min)) * 100;

    return (
        <div className="w-full p-4">
            <div className="text-sm mb-2 text-muted-foreground">Box Plot</div>
            <svg viewBox="0 0 100 20" className="w-full h-12">
                <line
                    x1={scale(min)}
                    x2={scale(q1)}
                    y1={10}
                    y2={10}
                    stroke="#999"
                    strokeWidth={1}
                />

                <line
                    x1={scale(q3)}
                    x2={scale(max)}
                    y1={10}
                    y2={10}
                    stroke="#999"
                    strokeWidth={1}
                />

                <rect
                    x={scale(q1)}
                    y={5}
                    width={scale(q3) - scale(q1)}
                    height={10}
                    fill="#e2e8f0"
                    stroke="#64748b"
                    strokeWidth={1}
                />

                <line
                    x1={scale(median)}
                    x2={scale(median)}
                    y1={5}
                    y2={15}
                    stroke="#1e293b"
                    stroke-width={1.5}
                />

                <line
                    x1={scale(min)}
                    x2={scale(min)}
                    y1={7}
                    y2={13}
                    stroke="#666"
                    strokeWidth={1}/>

                <line
                    x1={scale(max)}
                    x2={scale(max)}
                    y1={7}
                    y2={13}
                    stroke="#666"
                    strokeWidth={1}/>
            </svg>
        </div>
    )
};