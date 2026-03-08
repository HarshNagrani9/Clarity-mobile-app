import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, type ViewStyle } from 'react-native';

interface BrutalistButtonProps {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  shadowColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const BrutalistButton = ({
  children,
  bgColor = '#ffffff',
  textColor = '#000000',
  shadowColor = '#000000',
  onPress,
  style,
}: BrutalistButtonProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[{ alignSelf: 'flex-start' }, style]}
    >
      <View style={s.wrapper}>
        {/* Shadow layer */}
        <View
          style={[
            s.shadow,
            { backgroundColor: shadowColor, borderColor: '#000' },
            pressed ? s.shadowPressed : s.shadowIdle,
          ]}
        />
        {/* Foreground */}
        <View
          style={[
            s.fg,
            { backgroundColor: bgColor, borderColor: '#000' },
            pressed && s.fgPressed,
          ]}
        >
          {typeof children === 'string' ? (
            <Text style={[s.label, { color: textColor }]}>{children}</Text>
          ) : (
            children
          )}
        </View>
      </View>
    </Pressable>
  );
};

const s = StyleSheet.create({
  wrapper: { position: 'relative' },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderRadius: 10,
    transform: [{ translateX: 6 }, { translateY: 6 }],
  },
  shadowIdle: { transform: [{ translateX: 6 }, { translateY: 6 }] },
  shadowPressed: { transform: [{ translateX: 2 }, { translateY: 2 }] },
  fg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fgPressed: { transform: [{ translateX: 4 }, { translateY: 4 }] },
  label: {
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 13,
  },
});
