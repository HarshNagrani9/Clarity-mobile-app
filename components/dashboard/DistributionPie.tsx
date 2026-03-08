import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3-shape';
import { useApp } from '../../lib/store';
import { BrutalistCard } from '../ui/BrutalistCard';

export function DistributionPie() {
    const { habits, goals, tasks } = useApp();

    const data = [
        { name: 'Habits', value: habits.length },
        { name: 'Goals', value: goals.length },
        { name: 'Tasks', value: tasks.length },
    ];

    // Filter out 0 value items if we want, or just let d3 handle it
    const COLORS = ['#10b981', '#f59e0b', '#3b82f6']; // Emerald, Amber, Blue

    const size = 200;
    const radius = size / 2;
    const innerRadius = radius * 0.6; // Donut chart

    const _pie = d3.pie<any>().value((d: any) => d.value).sort(null).padAngle(0.05);
    const _arc = d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(radius);

    const arcs = _pie(data as any);
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <BrutalistCard title="Focus Distribution" style={s.cardContainer}>
            <View style={s.chartContainer}>
                {total > 0 ? (
                    <Svg width={size} height={size}>
                        <G x={radius} y={radius}>
                            {arcs.map((arcData, index) => {
                                const path = _arc(arcData) || '';
                                return (
                                    <Path
                                        key={index}
                                        d={path}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                );
                            })}
                        </G>
                    </Svg>
                ) : (
                    <View style={s.emptyState}>
                        <Text style={s.emptyText}>No data to display</Text>
                    </View>
                )}
            </View>

            {/* Legend */}
            <View style={s.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={s.legendItem}>
                        <View style={[s.legendColor, { backgroundColor: COLORS[index % COLORS.length] }]} />
                        <Text style={s.legendText}>{item.name}</Text>
                        <Text style={s.legendValue}> ({item.value})</Text>
                    </View>
                ))}
            </View>
        </BrutalistCard>
    );
}

const s = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 220,
    },
    emptyState: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#333',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#666',
        fontFamily: 'monospace',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 12,
        height: 12,
        marginRight: 6,
        borderRadius: 2,
    },
    legendText: {
        color: '#ccc',
        fontSize: 12,
        fontFamily: 'monospace',
    },
    legendValue: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    }
});
