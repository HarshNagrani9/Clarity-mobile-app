import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useApp } from '../../lib/store';
import { subDays, format } from 'date-fns';
import { BrutalistCard } from '../ui/BrutalistCard';
import { Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface RingData {
    name: string;
    completedDays: number;
    totalDays: number;
    color: string;
    streak: number;
}

export function HabitTrends() {
    const { habits } = useApp();

    const ringData: RingData[] = useMemo(() => {
        return habits.map((habit) => {
            const last7Days = Array.from({ length: 7 }).map((_, i) => {
                const date = subDays(new Date(), 6 - i);
                return format(date, 'yyyy-MM-dd');
            });

            const completedDays = last7Days.filter(d => habit.completedDates.includes(d)).length;

            return {
                name: habit.title,
                completedDays,
                totalDays: 7,
                color: habit.color || '#3b82f6',
                streak: habit.streak || 0,
            };
        });
    }, [habits]);

    if (habits.length === 0) {
        return (
            <BrutalistCard style={s.card}>
                <Text style={s.title}>Weekly Rings</Text>
                <Text style={s.emptyText}>Add habits to see your progress rings!</Text>
            </BrutalistCard>
        );
    }

    const ringSize = Math.min(width - 80, 240);
    const center = ringSize / 2;
    const strokeWidth = Math.max(10, 28 - (habits.length * 3));
    const gap = 4;

    // Calculate total completion for the center stat
    const totalCompleted = ringData.reduce((sum, r) => sum + r.completedDays, 0);
    const totalPossible = ringData.reduce((sum, r) => sum + r.totalDays, 0);
    const overallPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    return (
        <BrutalistCard style={s.card}>
            <View style={s.header}>
                <View>
                    <Text style={s.title}>Weekly Rings</Text>
                    <Text style={s.subtitle}>Last 7 days per habit</Text>
                </View>
            </View>

            <View style={s.ringContainer}>
                <Svg width={ringSize} height={ringSize}>
                    <Defs>
                        {ringData.map((ring, i) => (
                            <LinearGradient key={`grad-${i}`} id={`ringGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                                <Stop offset="0%" stopColor={ring.color} stopOpacity={1} />
                                <Stop offset="100%" stopColor={ring.color} stopOpacity={0.6} />
                            </LinearGradient>
                        ))}
                    </Defs>

                    {ringData.map((ring, index) => {
                        const radius = center - (strokeWidth + gap) * index - strokeWidth / 2 - 4;
                        if (radius <= 10) return null;

                        const circumference = 2 * Math.PI * radius;
                        const progress = ring.completedDays / ring.totalDays;
                        const dashOffset = circumference * (1 - progress);

                        return (
                            <React.Fragment key={index}>
                                {/* Background track */}
                                <Circle
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    stroke="#1E1E1E"
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                />
                                {/* Progress arc */}
                                <Circle
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    stroke={`url(#ringGrad${index})`}
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                    strokeDasharray={`${circumference}`}
                                    strokeDashoffset={dashOffset}
                                    strokeLinecap="round"
                                    transform={`rotate(-90, ${center}, ${center})`}
                                />
                            </React.Fragment>
                        );
                    })}
                </Svg>

                {/* Center stat */}
                <View style={[s.centerStat, { width: ringSize, height: ringSize }]}>
                    <Text style={s.centerPercent}>{overallPercent}%</Text>
                    <Text style={s.centerLabel}>overall</Text>
                </View>
            </View>

            {/* Legend */}
            <View style={s.legend}>
                {ringData.map((ring, i) => (
                    <View key={i} style={s.legendRow}>
                        <View style={s.legendLeft}>
                            <View style={[s.legendDot, { backgroundColor: ring.color }]} />
                            <Text style={s.legendName} numberOfLines={1}>{ring.name}</Text>
                        </View>
                        <View style={s.legendRight}>
                            <Text style={s.legendScore}>
                                {ring.completedDays}/{ring.totalDays}
                            </Text>
                            {ring.streak > 0 && (
                                <View style={s.streakBadge}>
                                    <Flame size={10} color="#f97316" fill="#f97316" />
                                    <Text style={s.streakNum}>{ring.streak}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </BrutalistCard>
    );
}

const s = StyleSheet.create({
    card: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        marginTop: 2,
    },
    emptyText: {
        color: '#666',
        fontSize: 13,
        textAlign: 'center',
        paddingVertical: 32,
        fontFamily: 'monospace',
    },
    ringContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    centerStat: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerPercent: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        fontFamily: 'monospace',
    },
    centerLabel: {
        color: '#666',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    legend: {
        gap: 10,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendName: {
        color: '#ccc',
        fontSize: 13,
        fontFamily: 'monospace',
        flex: 1,
    },
    legendRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendScore: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(249, 115, 22, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    streakNum: {
        color: '#f97316',
        fontSize: 11,
        fontWeight: 'bold',
    },
});
