import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface BrutalistCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  accentColor?: string; // hex, e.g. '#ec4899'
  style?: StyleProp<ViewStyle>;
}

export const BrutalistCard = ({
  children,
  title,
  icon,
  accentColor = '#a3e635',
  style
}: BrutalistCardProps) => {
  return (
    <View style={[s.outer, style]}>
      {/* Hard drop shadow */}
      <View style={s.shadow} />

      {/* Main card */}
      <View style={s.card}>
        {/* Header */}
        {title && (
          <View style={s.header}>
            <Text style={s.headerTitle}>{title}</Text>
            {icon && (
              <View style={[s.iconBox, { backgroundColor: accentColor }]}>
                {icon}
              </View>
            )}
          </View>
        )}

        {/* Body */}
        <View style={s.body}>{children}</View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  outer: { position: 'relative', marginBottom: 24 },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#121212',
    borderRadius: 14,
    transform: [{ translateX: 6 }, { translateY: 6 }],
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 14,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#9ca3af',
    fontWeight: '700',
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  iconBox: {
    padding: 6,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
  },
  body: { padding: 20 },
});
