import { writable } from 'svelte/store';

export let options = writable([
    {
        colors: ['#1A56DB', '#FDBA8C'],
        series: [
        {
            name: 'Organic',
            color: '#1A56DB',
            data: [] as { x: string, y: number }[]
        }
        ],
        chart: {
            type: 'bar' as const,
            height: '320px',
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                borderRadiusApplication: 'around' as const,
                borderRadius: 8
            }
        },
        tooltip: {
            enabled: false,
        },
        states: {
            hover: {
                filter: {
                type: 'darken',
                value: 1
                }
            }
        },
        stroke: {
            show: false,
            width: 0,
            colors: ['transparent']
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14
            }
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            show: true
        },
        xaxis: {
            show: true,
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: {
                show: true
            },
            axisTicks: {
                show: true
            }
        },
        yaxis: [{
            show: true,
            min: 0,
            max: 50,
            stepSize: 5
        }],
        fill: {
            type: 'solid' as const,
            opacity: 1
        }
    },{
        colors: ['#1A56DB', '#FDBA8C'],
        series: [
        {
            name: 'Organic',
            color: '#1A56DB',
            data: [] as { date: string, points: number }[]
        }
        ],
        chart: {
            type: 'bar' as const,
            height: '320px',
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                borderRadiusApplication: 'around' as const,
                borderRadius: 8
            }
        },
        tooltip: {
            enabled: false,
        },
        states: {
            hover: {
                filter: {
                type: 'darken',
                value: 1
                }
            }
        },
        stroke: {
            show: true,
            width: 0,
            colors: ['transparent']
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14
            }
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            show: true
        },
        xaxis: {
            show: true,
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: {
                show: true
            },
            axisTicks: {
                show: true
            }
        },
        yaxis: [{
            show: true,
            min: 0,
            max: 0,
            stepSize: 5
        }],
        fill: {
            type: 'solid' as const,
            opacity: 1
        }
    },{
        colors: ['#1A56DB', '#FDBA8C'],
        series: [
        {
            name: 'Organic',
            color: '#1A56DB',
            data: [] as { date: string, points: number }[]
        }
        ],
        chart: {
            type: 'bar' as const,
            height: '320px',
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                borderRadiusApplication: 'around' as const,
                borderRadius: 8
            }
        },
        tooltip: {
            enabled: false,
        },
        states: {
            hover: {
                filter: {
                type: 'darken',
                value: 1
                }
            }
        },
        stroke: {
            show: true,
            width: 0,
            colors: ['transparent']
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14
            }
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            show: true
        },
        xaxis: {
            show: true,
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: {
                show: true
            },
            axisTicks: {
                show: true
            }
        },
        yaxis: [{
            show: true,
            min: 0,
            max: 0,
            stepSize: 5
        }],
        fill: {
            type: 'solid' as const,
            opacity: 1
        }
    },{
        colors: ['#1A56DB', '#FDBA8C'],
        series: [
        {
            name: 'Organic',
            color: '#1A56DB',
            data: [] as { date: string, points: number }[]
        }
        ],
        chart: {
            type: 'bar' as const,
            height: '320px',
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                borderRadiusApplication: 'around' as const,
                borderRadius: 8
            }
        },
        tooltip: {
            enabled: false,
        },
        states: {
            hover: {
                filter: {
                type: 'darken',
                value: 1
                }
            }
        },
        stroke: {
            show: true,
            width: 0,
            colors: ['transparent']
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14
            }
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            show: true
        },
        xaxis: {
            show: true,
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: {
                show: true
            },
            axisTicks: {
                show: true
            }
        },
        yaxis: [{
            show: true,
            min: 0,
            max: 0,
            stepSize: 5
        }],
        fill: {
            type: 'solid' as const,
            opacity: 1
        }
    }
]);

export const combinedChartOptions = writable({
    colors: ['#1A56DB', '#FDBA8C', '#4CAF50', '#9C27B0'],
    series: [
        {
            name: 'Player1',
            color: '#1A56DB',
            data: [] as { x: string, y: number }[]
        },{
            name: 'Player2',
            color: '#FDBA8C',
            data: [] as { x: string, y: number }[]
        },{
            name: 'Player3',
            color: '#4CAF50',
            data: [] as { x: string, y: number }[]
        },{
            name: 'Player4',
            color: '#9C27B0',
            data: [] as { x: string, y: number }[]
        }
    ],
    chart: {
        type: 'bar' as const,
        height: '320px',
        width: '100%',
        fontFamily: 'Inter, sans-serif',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '70%',
            borderRadiusApplication: 'around' as const,
            borderRadius: 8
        }
    },
    tooltip: {
        enabled: false,
    },
    states: {
        hover: {
            filter: {
            type: 'darken',
            value: 1
            }
        }
    },
    stroke: {
        show: false,
        width: 0,
        colors: ['transparent']
    },
    grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
            left: 2,
            right: 2,
            top: -14
        }
    },
    dataLabels: {
        enabled: true
    },
    legend: {
        show: true,
        position: 'top', // Can be 'top', 'right', 'bottom', 'left'
        labels: {
            useSeriesColors: true, // Make sure labels use the series colors
            names: ['Player1', 'Player2', 'Player3', 'Player4'] // Custom names for the legend
        }
    },
    xaxis: {
        show: true,
        floating: false,
        labels: {
            show: true,
            style: {
                fontFamily: 'Inter, sans-serif',
                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
            }
        },
        axisBorder: {
            show: true
        },
        axisTicks: {
            show: true
        }
    },
    yaxis: [{
        show: true,
        min: 0,
        max: 50,
        stepSize: 5
    }],
    fill: {
        type: 'solid' as const,
        opacity: 1
    }
});