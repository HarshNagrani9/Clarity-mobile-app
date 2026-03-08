import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { useApp } from '../../lib/store';
import { subDays, format } from 'date-fns';
import { BrutalistCard } from '../ui/BrutalistCard';

const { width } = Dimensions.get('window');

export function HabitTrends() {
    const { habits } = useApp();

    // Replicate webapp "Daily Momentum" exact logic
    const dailyData = useMemo(() => {
        const dailyHabits = habits.filter(h => h.frequency === 'daily' || h.frequency === 'custom');

        return Array.from({ length: 14 }).map((_, i) => {
            const date = subDays(new Date(), 13 - i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const displayDate = format(date, 'MMM dd');

            let completedCount = 0;
            dailyHabits.forEach(h => {
                if (h.completedDates.includes(dateStr)) {
                    completedCount++;
                }
            });

            return {
                name: displayDate,
                completed: completedCount,
            };
        });
    }, [habits]);

    // Dimensions
    const chartHeight = 180;
    const chartWidth = width - 40 - 32; // window - screenPadding - cardPadding
    const yMax = Math.max(...dailyData.map(d => d.completed), 4); // Keep a scale of at least 4

    // Scale X to chart width
    const scaleX = (index: number) => (index / (dailyData.length - 1)) * chartWidth;
    // Scale Y to chart height (invert Y because SVG 0,0 is top-left)
    const scaleY = (value: number) => chartHeight - (value / yMax) * chartHeight;

    // Generate Area Path (Bottom filled)
    const areaGenerator = d3Shape.area<{ completed: number }>()
        .x((d, i) => scaleX(i))
        .y0(chartHeight)
        .y1((d) => scaleY(d.completed))
        .curve(d3Shape.curveMonotoneX);

    // Generate Line Path (Top strict line)
    const lineGenerator = d3Shape.line<{ completed: number }>()
        .x((d, i) => scaleX(i))
        .y((d) => scaleY(d.completed))
        .curve(d3Shape.curveMonotoneX);

    const areaPath = areaGenerator(dailyData) || '';
    const linePath = lineGenerator(dailyData) || '';

    return (
        <BrutalistCard style={s.card}>
            <View style={s.header}>
                <Text style={s.title}>Completion Trends</Text>
                <Text style={s.subtitle}>Daily Momentum (Last 14 Days)</Text>
            </View>

            <View style={s.chartContainer}>
                {/* Y-Axis Guidelines */}
                <View style={s.gridLinesAbsolute}>
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                        const val = Math.round(yMax * ratio);
                        return (
                            <View key={ratio} style={[s.gridLineWrapper, { top: scaleY(val) }]}>
                                <Text style={s.yAxisLabel}>{val}</Text>
                                <View style={s.dashLine} />
                            </View>
                        );
                    })}
                </View>

                {/* SVG Chart Layer */}
                <Svg width={chartWidth} height={chartHeight} style={s.svg}>
                    <Defs>
                        <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                            <Stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </LinearGradient>
                    </Defs>
                    <Path d={areaPath} fill="url(#gradient)" />
                    <Path d={linePath} fill="none" stroke="#06b6d4" strokeWidth={3} />
                </Svg>
            </View>

            {/* X-Axis Labels (First, Middle, Last) */}
            <View style={s.xAxis}>
                <Text style={s.xLabel}>{dailyData[0].name}</Text>
                <Text style={s.xLabel}>{dailyData[Math.floor(dailyData.length / 2)].name}</Text>
                <Text style={s.xLabel}>Today</Text>
            </View>
        </BrutalistCard>
    );
}

const s = StyleSheet.create({
    card: {
        marginBottom: 24,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 4,
    },
    chartContainer: {
        height: 180,
        position: 'relative',
        marginLeft: 20, // space for Y labels
    },
    gridLinesAbsolute: {
        ...StyleSheet.absoluteFillObject,
    },
    gridLineWrapper: {
        position: 'absolute',
        left: -20,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    yAxisLabel: {
        color: '#666',
        fontSize: 10,
        width: 15,
    },
    dashLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2A2A2A',
        marginLeft: 5,
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0, // already offset by chartContainer marginLeft
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20, // match chart offset
        marginTop: 8,
    },
    xLabel: {
        color: '#666',
        fontSize: 10,
    }
});
