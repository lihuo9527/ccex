export function fetchYesterdayProfitChartOption(titleText: string, titleSubtext: string, legendData: string[], seriesColor: string[], seriesData: { value: number | string, name: string }[]) {
    return {
        title: {
            text: titleText,
            subtext: titleSubtext,
            textStyle: {
                color: '#000',
                fontSize: 20,
                fontFamily: "Microsoft YaHei"
            },
            subtextStyle: {
                fontSize: 20,
                color: ['#ff9d19'],
                fontFamily: "Microsoft YaHei"
            },
            x: "center",
            y: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            bottom: 0,
            data: legendData,
            padding: [20, 0, 0, 0]
        },
        series: [
            {
                color: seriesColor,
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        formatter: false,
                        show: false,
                    },
                    emphasis: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: seriesData
            }
        ]
    }
}

export function fetchBalanceChartOption(seriesColor: string[], seriesData: { value: number | string, name: string }[]) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: "{b} ({d}%)"
        },
        legend: {
            bottom: 0,
            data: seriesData,
            x: "center",
            padding: 20
        },
        series: [
            {
                color: seriesColor,
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        formatter: false,
                        show: false,
                    },
                    emphasis: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: seriesData
            }
        ]
    }
}

export function fetchAnnualInterestRateChartOption(annualInterestRate: string, subtext: string, data: string[] = ['75', '25']) {
    return {
        title: {
            text: annualInterestRate,
            subtext: subtext,
            textStyle: {
                color: '#44d060',
                fontSize: 32,
            },
            subtextStyle: {
                fontSize: 30,
                color: '#44d060'
            },
            x: "center",
            y: 'center',
        },
        tooltip: {
            show: false,
        },
        toolbox: {
            show: false,
        },
        series: [
            {
                color: ['#a6f08f', 'rgba(0, 172, 220, 0.2)'],
                type: 'pie',
                clockWise: false,
                radius: [170, 178],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        shadowColor: 'rgba(40, 40, 40, 0.5)',
                    }
                },
                hoverAnimation: false,
                center: ['50%', '50%'],
                data: [
                    {
                        value: data[0],
                        label: {
                            normal: {
                                show: false,
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#a3f7ff',
                                shadowBlur: 10
                            }
                        }
                    },
                    {
                        value: data[1],
                        itemStyle: {
                            normal: {
                                color: 'rgba(0, 172, 220, 0.2)',
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                color: 'rgba(0, 172, 220, 0.2)'
                            }
                        }
                    }
                ]
            }
        ]
    }
}