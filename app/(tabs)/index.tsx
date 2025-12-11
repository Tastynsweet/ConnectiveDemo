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
          <View style={styles.heroCard}>
            <Text style={styles.cardLabel}>MONTH-TO-DATE COST</Text>
            <Text style={styles.heroValue}>$145.20</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>+2.4% vs last month</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Ionicons name="thermometer-outline" size={20} color={COLORS.textGray} style={{marginRight:5}}/>
                <Text style={styles.cardTitle}>Thermostat</Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Cooling</Text>
              </View>
            </View>
            
            <View style={styles.thermostatRow}>
              <Text style={styles.tempLarge}>72°</Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setHistoryVisible(true)}
              >
                <Text style={styles.actionButtonText}>View Usage</Text>
              </TouchableOpacity>
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
                      labels: ["12P", "2P", "4P", "6P", "8P", "10P", "12A", "2A", "4A", "6A"],
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
  heroCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 25, marginBottom: 20, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: '#8E8E93', letterSpacing: 1, marginBottom: 10 },
  heroValue: { fontSize: 52, fontWeight: '800', color: '#1C1C1E' },
  badge: { backgroundColor: '#E4F9E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: '#00A836', fontSize: 13, fontWeight: '700' },

  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1c1c1e' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34C759', marginRight: 6 },
  statusText: { fontSize: 14, fontWeight: '600', color: '#34C759' },

  thermostatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tempLarge: { fontSize: 56, fontWeight: '300', color: '#1c1c1e' },
  
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
});