import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import './FlexibleBarChart.css'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const FlexibleBarChart = ({ 
    chartData, 
    chartOptions = {}, 
    type = 'bar',
    stacked = false 
}) => {

    const ChartComponent = type === 'line' 
        ? Line 
        : type === 'pie' 
        ? Pie 
        : Bar;

    // 👇 Slimmer Bar Width (global override)
        const updatedChartData = {
            ...chartData,
            datasets: chartData.datasets.map(ds => ({
                ...ds,
                barThickness: ds.barThickness ?? 38   // Use existing OR default
            }))
        };


    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',

                // 👇 Round legend color dot
                labels: { 
                    color: '#f0f0f0',
                    usePointStyle: true,
                    pointStyle: "circle"
                }
            },

            title: {
                // display: true,
                // text: 'Chart Data Overview',
                color: '#f0f0f0',
                font: { size: 16 }
            },

            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#f0f0f0',
                bodyColor: '#f0f0f0',
            },
        },

        scales: {
            x: {
                stacked,
                grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false },
                ticks: { color: '#f0f0f0' },
                barPercentage: 0.8, 
                categoryPercentage: 0.7,
            },
            y: {
                stacked,
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false },
                ticks: { 
                    color: '#f0f0f0',
                    callback: value => value >= 1000 ? value / 1000 + 'k' : value
                }
            }
        }
    };

    const finalOptions = type === 'pie'
        ? { ...baseOptions.plugins, ...chartOptions }
        : { ...baseOptions, ...chartOptions };

    return (
        <div className='chart-component-conrainer'>

            
            <ChartComponent data={updatedChartData} options={finalOptions} />
        </div>
    );
};

export default FlexibleBarChart;
