import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

// --- COLOR PALETTE ---
const COLORS = {
  primary: '#007AFF',
  card: '#FFFFFF',
  textDark: '#1c1c1e',
  textGray: '#8E8E93',
  success: '#34C759',
  alert: '#FF3B30' // Red
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [hvacOn, setHvacOn] = useState(false);
  const [targetTemp, setTargetTemp] = useState(72);
  const [hvacConfirmVisible, setHvacConfirmVisible] = useState(false);
  const [pendingHvacValue, setPendingHvacValue] = useState<boolean | null>(null);
  const [prevHvacValue, setPrevHvacValue] = useState<boolean | null>(null);
  const [popupAction, setPopupAction] = useState<string | null>(null);

  const increaseTemp = () => setTargetTemp(t => Math.min(90, t + 1));
  const decreaseTemp = () => setTargetTemp(t => Math.max(50, t - 1));
  
  const date = new Date();
  const dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const BackgroundDesign = () => (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={['#ffffff', '#f0f8ff']} 
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[styles.bubble, { top: -100, left: -100, width: 300, height: 300, borderRadius: 150 }]} />
      <View style={[styles.bubble, { bottom: -50, right: -50, width: 250, height: 250, borderRadius: 125 }]} />
      <View style={[styles.bubble, { top: 50, right: -20, width: 100, height: 100, borderRadius: 50, opacity: 0.05 }]} />
    </View>
  );

  // --- SCREEN 1: LOGIN ---
  const renderLogin = () => (
    <View style={{flex: 1}}>
      <BackgroundDesign />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.loginContainer}
      >
        <View style={styles.loginContent}>
          <View style={styles.logoSection}>
            {/* LOGO IMAGE */}
            <Image 
              source={require('../../assets/Logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
            <Text style={styles.appTitle}>Connective</Text>
            <Text style={styles.appTagline}>Make every watt count.</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setCurrentScreen('dashboard')}
            >
              <Text style={styles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );

  // --- SCREEN 2: DASHBOARD ---
  const renderDashboard = () => (
    <View style={{flex: 1}}>
      <BackgroundDesign />
      <SafeAreaView style={styles.container}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Hi, User!</Text>
            <Text style={styles.dateText}>{dateString}</Text>
          </View>
          <View style={styles.headerRight}>
             <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreen('login')} style={styles.profileButton}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.profileImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Month Card Row */}
          <View style={[styles.heroCard, styles.topCard, { marginBottom: 20 }]}>
            <Text style={styles.cardLabel}>MONTH-TO-DATE COST</Text>
            <Text style={styles.heroValue}>$145.20</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>+2.4% vs last month</Text>
            </View>
          </View>

          {/* Thermostat Card with all controls */}
          <View style={[styles.card, { marginBottom: 0 }]}>
            <View style={styles.cardHeader}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Ionicons name="thermometer-outline" size={20} color={COLORS.textGray} style={{marginRight:5}}/>
                <Text style={styles.cardTitle}>Thermostat</Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: hvacOn ? '#34C759' : '#999' }]} />
                <Text style={[styles.statusText, { color: hvacOn ? '#34C759' : '#999' }]}>{!hvacOn ? 'Off' : (targetTemp > 76 ? 'Heating' : 'Cooling')}</Text>
              </View>
            </View>
            
            {/* Thermostat temperature display */}
            <Text style={styles.tempLarge}>{targetTemp}°</Text>
            
            {/* +/- Control buttons - Spaced out */}
            <View style={[styles.controlRow, { gap: 40 }]}>
              <TouchableOpacity style={styles.controlButton} onPress={decreaseTemp}>
                <Text style={styles.controlButtonText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={increaseTemp}>
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            {/* View Usage button */}
            <TouchableOpacity 
              style={[styles.actionButton, { alignSelf: 'center', marginTop: 16 }]}
              onPress={() => setHistoryVisible(true)}
            >
              <Text style={styles.actionButtonText}>View Usage</Text>
            </TouchableOpacity>
            
            {/* HVAC Switch at bottom left */}
            <View style={styles.switchBottomContainer}>
              <View style={styles.thermostatSwitchContainer}>
                <Switch
                  value={hvacOn}
                  onValueChange={(val) => {
                    setPrevHvacValue(hvacOn);
                    setHvacOn(val);
                    setPopupAction(val ? 'ON' : 'OFF');
                    setHvacConfirmVisible(true);
                  }}
                  trackColor={{ true: '#A8E6CF', false: '#E5E5EA' }}
                  thumbColor={hvacOn ? COLORS.primary : '#fff'}
                  style={styles.thermostatSwitch}
                />
              </View>
            </View>
          </View>
        </View>

        {/* --- BIG POP-UP (MODAL) --- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={historyVisible}
          onRequestClose={() => setHistoryVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              
              {/* Vertical Scroll for Modal */}
              <ScrollView showsVerticalScrollIndicator={false}>
                
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Usage History</Text>
                  <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                    <Ionicons name="close-circle" size={32} color="#ccc" />
                  </TouchableOpacity>
                </View>

                <View style={styles.alertBanner}>
                  <Ionicons name="warning" size={24} color="#FF3B30" style={{marginRight: 10}} />
                  <Text style={styles.alertText}>Abnormal Power Signature</Text>
                </View>

                <Text style={styles.chartSubtitle}>Runtime (Blue) vs Energy (Orange)</Text>
                
                {/* Horizontal Scroll for Chart */}
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={{marginHorizontal: -10}}>
                  <LineChart
                    data={{
                      labels: ["12PM", "2PM", "4PM", "6PM", "8PM", "10PM", "12AM", "2AM", "4AM", "6AM"],
                      datasets: [
                        { 
                          data: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2], 
                          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, 
                          strokeWidth: 3 
                        },
                        { 
                          data: [0.5, 0.5, 1.5, 8.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5], 
                          color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`, 
                          strokeWidth: 4 
                        }
                      ]
                    }}
                    width={screenWidth * 2} 
                    height={300}
                    chartConfig={{
                      backgroundColor: "#fff",
                      backgroundGradientFrom: "#fff",
                      backgroundGradientTo: "#fff",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
                      propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
                      propsForBackgroundLines: { strokeDasharray: "" }
                    }}
                    bezier
                    style={styles.chart}
                  />
                </ScrollView>
                <Text style={styles.scrollHint}>Swipe graph to see more ➡</Text>

                <View style={styles.insightBox}>
                  <Text style={styles.insightTitle}>Insight Analysis</Text>
                  <Text style={styles.insightText}>
                    At 6:00 PM, power draw spiked to 8.5kW despite constant runtime. This is a critical indicator of a compressor stall or electrical fault.
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.resolveButton}
                  onPress={() => setHistoryVisible(false)}
                >
                  <Text style={styles.resolveButtonText}>Resolve Issue</Text>
                </TouchableOpacity>
                
                <View style={{height: 40}} /> 
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* HVAC Confirm Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={hvacConfirmVisible}
          onRequestClose={() => setHvacConfirmVisible(false)}
        >
          <View style={styles.hvacModalOverlay}>
              <View style={styles.hvacModalContent}>
              <Text style={styles.modalTitle}>Confirm HVAC</Text>
              <Text style={{color: '#444', marginTop: 8, marginBottom: 20}}>
                {popupAction ? `Are you sure you want to turn the HVAC ${popupAction}?` : 'Are you sure you want to turn HVAC?'}
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#F2F2F7', marginRight: 10}]} onPress={() => {
                  // cancel: revert switch and close modal without changing text
                  if (prevHvacValue !== null) setHvacOn(prevHvacValue);
                  setPrevHvacValue(null);
                  setHvacConfirmVisible(false);
                }}>
                  <Text style={{color: '#666', fontWeight: '700'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, {backgroundColor: COLORS.primary}]} onPress={() => {
                  // confirm: keep switch state and close modal
                  setPopupAction(hvacOn ? 'ON' : 'OFF');
                  setPrevHvacValue(null);
                  setHvacConfirmVisible(false);
                }}>
                  <Text style={{color: '#fff', fontWeight: '700'}}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      {currentScreen === 'login' && renderLogin()}
      {currentScreen === 'dashboard' && renderDashboard()}
    </>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  bubble: { position: 'absolute', backgroundColor: 'rgba(0,122,255,0.1)' },
  
  // Login
  loginContainer: { flex: 1, justifyContent: 'center' },
  loginContent: { padding: 30, zIndex: 10 },
  logoSection: { alignItems: 'center', marginBottom: 50 },
  logoImage: { width: 120, height: 120, marginBottom: 15 }, 
  appTitle: { fontSize: 36, fontWeight: '800', color: '#1c1c1e', letterSpacing: -0.5 },
  appTagline: { fontSize: 16, color: '#666', marginTop: 5 },
  inputContainer: { width: '100%', backgroundColor: 'rgba(255,255,255,0.85)', padding: 20, borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  input: { backgroundColor: '#fff', height: 50, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E5E5EA' },

  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  greetingText: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  dateText: { fontSize: 14, color: '#666', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginRight: 15, padding: 8, backgroundColor: 'white', borderRadius: 20 },
  profileButton: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 },
  profileImage: { width: 45, height: 45, borderRadius: 25, borderWidth: 2, borderColor: 'white' },

  // Cards
  heroCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 20, marginBottom: 20, alignItems: 'flex-start', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: '#8E8E93', letterSpacing: 1, marginBottom: 10 },
  heroValue: { fontSize: 52, fontWeight: '800', color: '#1C1C1E' },
  badge: { backgroundColor: '#E4F9E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: '#00A836', fontSize: 13, fontWeight: '700' },

  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 },
  rowCards: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardHalf: { flex: 1 },
  hvacCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, width: '100%' },
  hvacBottomCard: { minHeight: 140 },
  hvacStatusText: { fontSize: 16, fontWeight: '700', color: '#4A4A4A' },
  hvacDot: { width: 10, height: 10, borderRadius: 6, marginRight: 10 },
  hvacSwitch: { transform: [{ scale: 1.8 }] },
  topCard: { minHeight: 180 },
  controlCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6 },
  controlBottomCard: { minHeight: 140 },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  controlButton: { backgroundColor: '#F2F2F7', width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4 },
  controlButtonText: { fontSize: 52, color: COLORS.textDark, lineHeight: 52 },
  controlTemp: { fontSize: 28, fontWeight: '700', color: '#1c1c1e' },
  leftColumn: { flex: 1, marginRight: 12 },
  rightColumn: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1c1c1e' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34C759', marginRight: 6 },
  statusText: { fontSize: 18, fontWeight: '600', color: '#34C759' },

  thermostatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tempLarge: { fontSize: 80, fontWeight: '300', color: '#1c1c1e', marginBottom: 16 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 12, gap: 20 },
  thermostatSwitchContainer: { justifyContent: 'center', alignItems: 'center' },
  thermostatSwitch: { transform: [{ scale: 1.8 }] },
  switchBottomContainer: { position: 'absolute', bottom: 30, left: 30 },
  
  primaryButton: { backgroundColor: COLORS.primary, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: {width:0, height:4} },
  primaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
  actionButton: { backgroundColor: '#F2F2F7', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
  actionButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { 
    backgroundColor: 'white', 
    borderRadius: 24, 
    padding: 20, 
    width: '90%',        
    height: '85%',       
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 20, 
    elevation: 5 
  },
  modalHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 26, fontWeight: '800', color: '#1c1c1e' },
  
  alertBanner: { width: '100%', backgroundColor: '#FFF0F0', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  alertText: { color: '#FF3B30', fontWeight: '600', fontSize: 15 },
  
  chartSubtitle: { fontSize: 14, color: '#8E8E93', marginBottom: 5, alignSelf: 'flex-start', fontWeight:'500' },
  chart: { marginVertical: 10, borderRadius: 16 },
  scrollHint: { fontSize: 12, color: '#999', fontStyle: 'italic', alignSelf: 'center', marginBottom: 15 },
  
  insightBox: { width: '100%', backgroundColor: '#FFF8EB', padding: 20, borderRadius: 16, marginTop: 5, borderLeftWidth: 5, borderLeftColor: '#FF9500' },
  insightTitle: { fontSize: 16, fontWeight: '800', color: '#FF9500', marginBottom: 5 },
  insightText: { fontSize: 15, color: '#4A4A4A', lineHeight: 22 },

  resolveButton: { width: '100%', backgroundColor: COLORS.alert, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 30 },
  resolveButtonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  hvacModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  hvacModalContent: { width: '85%', backgroundColor: 'white', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
});