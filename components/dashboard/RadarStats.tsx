import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, G } from 'react-native-svg';
import { useApp } from '../../lib/store';
import { format } from 'date-fns';
import { BrutalistCard } from '../ui/BrutalistCard';

export function RadarStats() {
    const { habits, goals, tasks } = useApp();

    // Replicate EXACT webapp logic
    const today = format(new Date(), 'yyyy-MM-dd');
    const dailyHabits = habits.filter(h => h.frequency === 'daily');
    const totalDaily = dailyHabits.length;
    const completedDaily = dailyHabits.filter(h => h.completedDates.includes(today)).length;
    const habitScore = totalDaily > 0 ? (completedDaily / totalDaily) * 100 : 0;

    const totalGoals = goals.length;
    const totalGoalProgress = goals.reduce((acc, g) => acc + (g.progress || 0), 0);
    const goalScore = totalGoals > 0 ? totalGoalProgress / totalGoals : 0;

    const pendingTasksCount = tasks.filter(t => !t.completed).length;
    const taskScore = Math.max(0, 100 - (pendingTasksCount * 10));

    const goalsWithMilestones = goals.filter(g => g.milestones && (g.milestones as any[]).length > 0).length;
    const focusScore = goals.length > 0 ? (goalsWithMilestones / goals.length) * 100 : 0;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const data = [
        { subject: 'Habits', score: habitScore },
        { subject: 'Goals', score: goalScore },
        { subject: 'Tasks', score: taskScore },
        { subject: 'Focus', score: focusScore },
        { subject: 'Action', score: completionScore },
    ];

    // SVG Math for Radar
    const size = 260;
    const center = size / 2;
    const radius = size * 0.35; // leaves room for labels
    const angleStep = (Math.PI * 2) / data.length;

    // Generate grid lines (pentagons)
    const gridLevels = 5;
    const gridPolygons = [];
    for (let i = 1; i <= gridLevels; i++) {
        const levelRadius = radius * (i / gridLevels);
        let points = "";
        for (let j = 0; j < data.length; j++) {
            const angle = j * angleStep - Math.PI / 2; // -90deg to start at top
            const x = center + levelRadius * Math.cos(angle);
            const y = center + levelRadius * Math.sin(angle);
            points += `${x},${y} `;
        }
        gridPolygons.push(<Polygon key={`grid-${i}`} points={points.trim()} fill="none" stroke="#333" strokeWidth="1" />);
    }

    // Generate axes
    const axes = data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        return <Line key={`axis-${i}`} x1={center} y1={center} x2={x2} y2={y2} stroke="#333" strokeWidth="1" />;
    });

    // Generate data polygon
    let dataPoints = "";
    data.forEach((d, i) => {
        const val = Math.max(0, Math.min(100, d.score)); // clamp 0-100
        const dataRadius = radius * (val / 100);
        const angle = i * angleStep - Math.PI / 2;
        const x = center + dataRadius * Math.cos(angle);
        const y = center + dataRadius * Math.sin(angle);
        dataPoints += `${x},${y} `;
    });

    // Generate labels
    const labels = data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        // pushed out slightly more than radius
        const labelRadius = radius + 25;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
            <SvgText
                key={`label-${i}`}
                x={x}
                y={y}
                fill="#888"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                alignmentBaseline="middle"
            >
                {d.subject}
            </SvgText>
        );
    });

    return (
        <BrutalistCard title="Performance" style={s.cardContainer}>
            <View style={s.chartContainer}>
                <Svg width={size} height={size}>
                    <G>
                        {gridPolygons}
                        {axes}
                        <Polygon
                            points={dataPoints.trim()}
                            fill="#8b5cf6"
                            fillOpacity="0.5"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                        />
                        {labels}
                    </G>
                </Svg>
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
    }
});
