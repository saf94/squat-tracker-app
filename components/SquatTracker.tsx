import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface HourData {
  key: string;
  display: string;
  isCompleted: boolean;
  hasPassed: boolean;
  isMissed: boolean;
  isFuture: boolean;
  isCurrentHour: boolean;
}

export function SquatTracker() {
  const { getSquatStatus, toggleSquat } = useLocalStorage();
  const [pressAnimations] = useState(() => 
    Array.from({ length: 9 }, () => new Animated.Value(1))
  );
  
  // Get current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Get current time
  const now = new Date();
  const currentHour = now.getHours();
  
  // Format current date for display
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate hours from 10am to 6pm
  const hours: HourData[] = [];
  for (let i = 10; i <= 18; i++) {
    const hour = i === 12 ? 12 : i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? 'PM' : 'AM';
    const hourKey = `${i.toString().padStart(2, '0')}:00`;
    const displayTime = `${hour}${ampm}`;
    
    const isCompleted = getSquatStatus(currentDate, hourKey);
    const hasPassed = i < currentHour;
    const isCurrentHour = i === currentHour;
    const isMissed = hasPassed && !isCompleted;
    const isFuture = i > currentHour;
    
    hours.push({
      key: hourKey,
      display: displayTime,
      isCompleted,
      hasPassed,
      isMissed,
      isFuture,
      isCurrentHour,
    });
  }

  const handleHourPress = (hourKey: string, index: number) => {
    const hour = hours[index];
    
    // Don't allow selection of future hours
    if (hour.isFuture) {
      return;
    }
    
    // Animate the button press
    Animated.sequence([
      Animated.timing(pressAnimations[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pressAnimations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    toggleSquat(currentDate, hourKey);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title" style={styles.dateText}>
          {formattedDate}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.contentContainer}>
        <View style={styles.hoursGrid}>
          {hours.map((hour, index) => (
            <Animated.View
              key={hour.key}
              style={[
                styles.hourButtonContainer,
                { transform: [{ scale: pressAnimations[index] }] },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.hourButton,
                  hour.isCompleted && styles.completedHour,
                  hour.isMissed && styles.missedHour,
                  hour.isFuture && styles.futureHour,
                  hour.isCurrentHour && !hour.isCompleted && styles.currentHour,
                ]}
                onPress={() => handleHourPress(hour.key, index)}
                activeOpacity={hour.isFuture ? 1 : 0.8}
                disabled={hour.isFuture}
              >
                <ThemedText
                  style={[
                    styles.hourText,
                    hour.isCompleted && styles.completedHourText,
                    hour.isMissed && styles.missedHourText,
                    hour.isFuture && styles.futureHourText,
                    hour.isCurrentHour && !hour.isCompleted && styles.currentHourText,
                  ]}
                >
                  {hour.display}
                </ThemedText>
                {hour.isCompleted && (
                  <View style={styles.checkmarkContainer}>
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  </View>
                )}
                {hour.isMissed && (
                  <View style={styles.crossContainer}>
                    <ThemedText style={styles.cross}>✗</ThemedText>
                  </View>
                )}
                {hour.isCurrentHour && !hour.isCompleted && (
                  <View style={styles.hourglassContainer}>
                    <ThemedText style={styles.hourglass}>⏳</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        
        <ThemedView style={styles.statsContainer}>
          <ThemedText style={styles.statsText}>
            Today&apos;s Progress: {hours.filter(h => h.isCompleted).length} of {hours.filter(h => !h.isFuture).length} available hours
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dateText: {
    textAlign: 'center',
    color: '#1e293b',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  hourButtonContainer: {
    width: '30%',
    aspectRatio: 1,
    minWidth: 90,
  },
  hourButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedHour: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOpacity: 0.3,
  },
  missedHour: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
  },
  futureHour: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    shadowOpacity: 0.05,
  },
  currentHour: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.3,
  },
  hourText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#374151',
  },
  completedHourText: {
    color: '#ffffff',
  },
  missedHourText: {
    color: '#ffffff',
  },
  futureHourText: {
    color: '#94a3b8',
  },
  currentHourText: {
    color: '#92400e',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  crossContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cross: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  hourglassContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  hourglass: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  statsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
});
