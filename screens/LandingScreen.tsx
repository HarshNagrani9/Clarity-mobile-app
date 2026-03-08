import '../global.css';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { BrutalistCard } from '../components/ui/BrutalistCard';
import {
  Zap,
  Target,
  Layout,
  Database,
  Mail,
  TrendingUp,
  CheckCircle,
  Calendar,
  Shield,
  Cpu,
  Terminal,
} from 'lucide-react-native';

type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

const { width } = Dimensions.get('window');

/* ─── NAVBAR ─── */
const Navbar = ({ navigation }: { navigation: LandingScreenNavigationProp }) => (
  <View style={s.navBar}>
    <View style={s.navLogoRow}>
      <View style={s.navIcon}>
        <Zap size={22} color="#000" />
      </View>
      <Text style={s.navTitle}>CLARITY</Text>
    </View>
    <BrutalistButton
      bgColor="#fff"
      textColor="#000"
      shadowColor="#a3e635"
      style={{ transform: [{ scale: 0.8 }] }}
      onPress={() => navigation.navigate('Signup')}
    >
      Sign Up
    </BrutalistButton>
  </View>
);

/* ─── GUEST CREDENTIALS ─── */
const GuestCredentials = ({ navigation }: { navigation: LandingScreenNavigationProp }) => {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Pressable onPress={() => setOpen(true)} style={s.guestClosed}>
        <View style={s.guestIconCircle}>
          <Mail size={18} color="#fff" />
        </View>
        <Text style={s.guestClosedText}>Unlock Guest Access</Text>
      </Pressable>
    );
  }

  return (
    <View style={s.guestOpen}>
      <View style={s.guestDotRow}>
        <View style={s.guestDot} />
        <Text style={s.guestLabel}>GUEST CREDENTIALS</Text>
      </View>
      <View style={s.guestCredRow}>
        <Text style={s.guestCredText}>guest@gmail.com</Text>
      </View>
      <View style={s.guestCredRow}>
        <Text style={s.guestCredText}>123456</Text>
      </View>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={s.guestClose}>Use Credentials to Login</Text>
      </Pressable>
    </View>
  );
};

/* ─── STREAK BAR CHART ─── */
const StreakBars = () => {
  const heights = [80, 100, 60, 40, 100, 90, 100];
  return (
    <View style={s.barRow}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            s.bar,
            {
              height: `${h}%`,
              backgroundColor: h === 100 ? '#ec4899' : '#374151',
            },
          ]}
        />
      ))}
    </View>
  );
};

/* ─── VELOCITY BARS ─── */
const VelocityBars = () => {
  const heights = [30, 45, 35, 60, 50, 80, 70, 95];
  return (
    <View style={s.velocityContainer}>
      <View style={s.barRow}>
        {heights.map((h, i) => (
          <View
            key={i}
            style={[
              s.bar,
              {
                height: `${h}%`,
                backgroundColor: '#7c3aed',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

/* ─── MARQUEE STRIP ─── */
const MarqueeStrip = () => (
  <View style={s.marquee}>
    <Text style={s.marqueeText} numberOfLines={1}>
      {'●  RELENTLESS PROGRESS  ○  EXECUTE WITH CLARITY  '
        .repeat(4)}
    </Text>
  </View>
);

/* ─── METHODOLOGY SECTION ─── */
const MethodologySection = () => {
  const stats = [
    { label: 'Habit Logic', val: 'Streaks', Icon: Target },
    { label: 'Visual Data', val: 'Heatmaps', Icon: TrendingUp },
    { label: 'Day Agenda', val: 'Unified', Icon: Calendar },
    { label: 'Goal Engine', val: 'Milestones', Icon: CheckCircle },
  ];

  return (
    <View style={s.methodSection}>
      <View style={s.methodPill}>
        <Terminal size={14} color="#a3e635" />
        <Text style={s.methodPillText}>OPTIMIZATION MAXIMAL</Text>
      </View>
      <Text style={s.methodTitle}>
        ENGINEERED FOR{'\n'}
        <Text style={s.methodTitleAccent}>OBSESSION</Text>
      </Text>
      <View style={s.methodGrid}>
        {stats.map((item, i) => (
          <View key={i} style={s.methodCard}>
            <item.Icon size={20} color="#9ca3af" />
            <Text style={s.methodCardVal}>{item.val}</Text>
            <Text style={s.methodCardLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/* ─── FLOW STATE CTA SECTION ─── */
const FlowStateCTA = ({ navigation }: { navigation: LandingScreenNavigationProp }) => (
  <View style={s.ctaSection}>
    <View style={s.ctaVerLabel}>
      <Text style={s.ctaVerText}>Version 1.0 Ready</Text>
    </View>
    <Text style={s.ctaTitle}>
      DESIGNED FOR{'\n'}
      <Text style={s.ctaTitleWhite}>FLOW STATE.</Text>
    </Text>
    <Text style={s.ctaDesc}>
      Every pixel, animation, and interaction is crafted to keep you in the zone.
      Fast. Fluid. Unyielding.
    </Text>

    <View style={s.ctaFeatures}>
      {[
        { Icon: Zap, label: 'Keyboard First Navigation' },
        { Icon: Shield, label: 'Offline-First Architecture' },
        { Icon: Cpu, label: 'Zero-Lag Optimistic UI' },
      ].map((f, i) => (
        <View key={i} style={s.ctaFeatureRow}>
          <View style={s.ctaFeatureIcon}>
            <f.Icon size={14} color="#a3e635" />
          </View>
          <Text style={s.ctaFeatureLabel}>{f.label}</Text>
        </View>
      ))}
    </View>

    <BrutalistButton bgColor="#fff" textColor="#000" style={{ marginTop: 24 }} onPress={() => navigation.navigate('Signup')}>
      Get Early Access
    </BrutalistButton>
  </View>
);

/* ─── FOOTER ─── */
const Footer = () => (
  <View style={s.footer}>
    <Text style={s.footerLogo}>CLARITY</Text>
    <View style={s.footerSocials}>
      {['X', 'In', 'Gh'].map((t, i) => (
        <View key={i} style={s.footerSocialIcon}>
          <Text style={s.footerSocialText}>{t}</Text>
        </View>
      ))}
    </View>
    <Text style={s.footerTagline}>ENGINEERED IN THE VOID.</Text>
    <Text style={s.footerCopy}>© 2024 CLARITY SYSTEMS INC.</Text>
  </View>
);

/* ═══════════════════════════════════
   MAIN APP
   ═══════════════════════════════════ */
export default function LandingScreen({ navigation }: { navigation: LandingScreenNavigationProp }) {
  return (
    <SafeAreaView style={s.safe}>
      {/* Background blobs */}
      <View style={s.blobLime} />
      <View style={s.blobPurple} />
      <View style={s.blobPink} />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <Navbar navigation={navigation} />

        {/* ── HERO ── */}
        <View style={s.hero}>
          <View style={s.heroSticker}>
            <Text style={s.heroStickerText}>FOCUS IS CURRENCY</Text>
          </View>

          <Text style={s.heroH1}>ORGANIZE</Text>
          <Text style={[s.heroH1, { color: '#a3e635' }]}>THE CHAOS</Text>
          <Text style={s.heroH1}>INSIDE.</Text>

          <View style={s.heroQuote}>
            <Text style={s.heroQuoteText}>
              The definitive operating system for high-performers. Turn ambiguous
              goals into data-driven streaks.
            </Text>
          </View>

          <BrutalistButton bgColor="#fff" textColor="#000" onPress={() => navigation.navigate('Login')}>
            Escape the Chaos
          </BrutalistButton>

          <GuestCredentials navigation={navigation} />
        </View>

        {/* ── MARQUEE ── */}
        <MarqueeStrip />

        {/* ── FEATURE CARDS ── */}
        <View style={s.features}>
          {/* Streak Engine */}
          <BrutalistCard
            title="Streak Engine"
            icon={<Target size={14} color="#000" />}
            accentColor="#ec4899"
          >
            <Text style={s.cardH3}>
              BUILD UNSTOPPABLE{'\n'}MOMENTUM.
            </Text>
            <Text style={s.cardP}>
              A visual tracking engine designed for consistency. Miss a day? The
              system holds you accountable.
            </Text>
            <StreakBars />
          </BrutalistCard>

          {/* Mission Control */}
          <BrutalistCard
            title="Mission Control"
            icon={<Layout size={14} color="#000" />}
            accentColor="#a3e635"
          >
            <Text style={s.cardH3}>
              TOTAL LIFE{'\n'}
              <Text style={{ color: '#a3e635' }}>ALIGNMENT.</Text>
            </Text>
            <Text style={s.cardP}>
              Calendar, Tasks, and Goals synchronized in real-time. Stop managing
              tools and start managing output.
            </Text>
            {['Drag & Drop Scheduling', 'Infinite Nested Tasks', 'Focus Mode'].map(
              (t, i) => (
                <View key={i} style={s.checkRow}>
                  <CheckCircle size={14} color="#a3e635" />
                  <Text style={s.checkText}>{t}</Text>
                </View>
              ),
            )}
          </BrutalistCard>

          {/* Private Core */}
          <BrutalistCard
            title="Private Core"
            icon={<Database size={14} color="#000" />}
            accentColor="#22d3ee"
          >
            <View style={s.privacyCenter}>
              <View style={s.privacyRing}>
                <Database size={32} color="#22d3ee" />
              </View>
            </View>
            <Text style={s.privacyLabel}>
              PRIVACY{'\n'}BY DESIGN
            </Text>
          </BrutalistCard>

          {/* Velocity Insights */}
          <BrutalistCard
            title="Velocity Insights"
            icon={<TrendingUp size={14} color="#000" />}
            accentColor="#a855f7"
          >
            <Text style={s.cardH3}>
              VISUALIZE YOUR{'\n'}
              <Text style={{ color: '#a855f7' }}>ASCENT.</Text>
            </Text>
            <Text style={s.cardP}>
              Track your trajectory with precision. We measure meaningful output,
              not just activity.
            </Text>
            <VelocityBars />
          </BrutalistCard>
        </View>

        {/* ── METHODOLOGY ── */}
        <MethodologySection />

        {/* ── FLOW STATE ── */}
        <FlowStateCTA navigation={navigation} />

        {/* ── FOOTER ── */}
        <Footer />
      </ScrollView>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════
   STYLES
   ═══════════════════════════════════ */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f0f' },
  scroll: { flex: 1, paddingHorizontal: 20 },

  /* Blobs */
  blobLime: {
    position: 'absolute',
    top: 40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(163,230,53,0.12)',
  },
  blobPurple: {
    position: 'absolute',
    top: '50%' as any,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(168,85,247,0.12)',
  },
  blobPink: {
    position: 'absolute',
    top: '30%' as any,
    left: '30%' as any,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(236,72,153,0.06)',
  },

  /* Navbar */
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
  },
  navLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  navIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#a3e635',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    fontStyle: 'italic',
    letterSpacing: -1,
    fontFamily: 'monospace',
  },

  /* Hero */
  hero: { paddingTop: 28, paddingBottom: 40 },
  heroSticker: {
    alignSelf: 'flex-start',
    backgroundColor: '#ec4899',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 24,
    transform: [{ rotate: '-3deg' }],
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    // Android
    elevation: 6,
  },
  heroStickerText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroH1: {
    fontSize: 52,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 54,
    letterSpacing: -2,
  },
  heroQuote: {
    borderLeftWidth: 4,
    borderLeftColor: '#a3e635',
    paddingLeft: 16,
    paddingVertical: 8,
    marginTop: 24,
    marginBottom: 28,
  },
  heroQuoteText: {
    fontSize: 16,
    color: '#9ca3af',
    fontFamily: 'monospace',
    lineHeight: 24,
  },

  /* Guest Credentials */
  guestClosed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 24,
    alignSelf: 'flex-start',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  guestIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestClosedText: { fontWeight: '700', fontSize: 13, color: '#d1d5db' },
  guestOpen: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#a3e635',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    alignSelf: 'stretch',
    // glow
    shadowColor: '#a3e635',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  guestDotRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  guestDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#a3e635' },
  guestLabel: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#a3e635',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  guestCredRow: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 8,
  },
  guestCredText: { fontFamily: 'monospace', fontSize: 13, color: '#9ca3af' },
  guestClose: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textDecorationLine: 'underline',
  },

  /* Marquee */
  marquee: {
    backgroundColor: '#a3e635',
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#000',
    paddingVertical: 10,
    marginHorizontal: -20,
    transform: [{ rotate: '-1deg' }],
    overflow: 'hidden',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  marqueeText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  /* Features section */
  features: { paddingTop: 40 },

  /* Card typography */
  cardH3: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 30,
  },
  cardP: {
    color: '#9ca3af',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  checkText: { fontFamily: 'monospace', fontSize: 13, color: '#fff' },

  /* Streak bars */
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 48,
    gap: 4,
    marginTop: 8,
  },
  bar: { flex: 1, borderRadius: 3 },

  /* Velocity */
  velocityContainer: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    height: 140,
    marginTop: 12,
  },

  /* Privacy */
  privacyCenter: { alignItems: 'center', justifyContent: 'center', height: 120 },
  privacyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#22d3ee',
    backgroundColor: 'rgba(8,145,178,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
  },

  /* Methodology */
  methodSection: {
    paddingVertical: 48,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#151515',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#a3e635',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 24,
  },
  methodPillText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#a3e635',
    letterSpacing: 1,
  },
  methodTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 36,
  },
  methodTitleAccent: {
    textDecorationLine: 'underline',
    textDecorationColor: '#ec4899',
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  methodCard: {
    width: (width - 72) / 2,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  methodCardVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  methodCardLabel: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginTop: 4,
  },

  /* Flow State CTA */
  ctaSection: {
    backgroundColor: '#a3e635',
    marginHorizontal: -20,
    paddingHorizontal: 24,
    paddingVertical: 48,
    borderTopWidth: 2,
    borderColor: '#000',
  },
  ctaVerLabel: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  ctaVerText: {
    color: '#a3e635',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  ctaTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000',
    lineHeight: 42,
    letterSpacing: -1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  ctaTitleWhite: {
    color: '#fff',
    // iOS text shadow approximation for drop-shadow
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
  },
  ctaDesc: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    lineHeight: 24,
    marginBottom: 20,
  },
  ctaFeatures: { gap: 12, marginBottom: 8 },
  ctaFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaFeatureIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#000',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaFeatureLabel: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },

  /* Footer */
  footer: {
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 32,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 16,
  },
  footerSocials: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  footerSocialIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSocialText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  footerTagline: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    letterSpacing: 2,
  },
  footerCopy: { fontFamily: 'monospace', fontSize: 11, color: '#6b7280' },
});
