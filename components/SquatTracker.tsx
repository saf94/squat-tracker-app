import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, Dimensions, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Initialize press animations for all 12 hours (10am to 9pm)
  const [pressAnimations] = useState(() => 
    Array.from({ length: 12 }, () => new Animated.Value(1))
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

  // Generate hours from 10am to 9pm
  const hours: HourData[] = [];
  for (let i = 10; i <= 21; i++) {
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

  const completedCount = hours.filter(h => h.isCompleted).length;
  const availableCount = hours.filter(h => !h.isFuture).length;
  const progressPercentage = availableCount > 0 ? (completedCount / availableCount) * 100 : 0;

  const handleHourPress = (hourKey: string, index: number) => {
    const hour = hours[index];
    
    // Don't allow selection of future hours
    if (hour.isFuture) {
      return;
    }
    
    // Ensure the animation value exists and is valid
    if (!pressAnimations[index] || typeof pressAnimations[index].setValue !== 'function') {
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

  const getTaskColor = (index: number) => {
    const taskColors = [colors.taskOrange, colors.taskYellow, colors.taskBeige, colors.taskBlue, colors.taskPurple];
    return taskColors[index % taskColors.length];
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Content Section with ScrollView */}
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.contentContainer}>
          {/* App Title with Date */}
          <View style={styles.titleContainer}>
            <ThemedText style={[styles.appDate, { color: colors.text }]}>
              {formattedDate}
            </ThemedText>
          </View>
          
          {/* Hours Grid */}
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
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    hour.isCompleted && [styles.completedHour, { backgroundColor: colors.success, borderColor: colors.success }],
                    hour.isMissed && [styles.missedHour, { backgroundColor: colors.error, borderColor: colors.error }],
                    hour.isFuture && [styles.futureHour, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }],
                    hour.isCurrentHour && !hour.isCompleted && [styles.currentHour, { backgroundColor: colors.warning, borderColor: colors.warning }],
                  ]}
                  onPress={() => handleHourPress(hour.key, index)}
                  activeOpacity={hour.isFuture ? 1 : 0.8}
                  disabled={hour.isFuture}
                >
                  <ThemedText
                    style={[
                      styles.hourText,
                      { color: colors.text },
                      hour.isCompleted && styles.completedHourText,
                      hour.isMissed && styles.completedHourText,
                      hour.isFuture && [styles.futureHourText, { color: colors.icon }],
                      hour.isCurrentHour && !hour.isCompleted && [styles.currentHourText, { color: colors.text }],
                    ]}
                  >
                    {hour.display}
                  </ThemedText>
                  
                  {/* Status Icons */}
                  {hour.isCompleted && (
                    <View style={[styles.statusContainer, { backgroundColor: colors.surface }]}>
                      <ThemedText style={[styles.statusIcon, { color: colors.success }]}>✓</ThemedText>
                    </View>
                  )}
                  {hour.isMissed && (
                    <View style={[styles.statusContainer, { backgroundColor: colors.surface }]}>
                      <ThemedText style={[styles.statusIcon, { color: colors.error }]}>✗</ThemedText>
                    </View>
                  )}
                  {hour.isCurrentHour && !hour.isCompleted && (
                    <View style={[styles.statusContainer, { backgroundColor: colors.surface }]}>
                      <ThemedText style={[styles.statusIcon, { color: colors.warning }]}>⏳</ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          
          {/* Stats Card */}
          <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.primary }]}>
                  {completedCount}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.icon }]}>
                  Completed
                </ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.primary }]}>
                  {Math.round(progressPercentage)}%
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.icon }]}>
                  Progress
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Account for bottom tab bar height + extra padding
  },
  contentContainer: {
    padding: 20,
    gap: 20,
    paddingTop: 20, // Reduced from 40
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 0, // Removed extra padding below the date
  },
  appDate: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8, // Reduced gap to ensure 3 columns fit
  },
  hourButtonContainer: {
    width: '31%', // Use percentage instead of calculated width
    aspectRatio: 1,
    marginBottom: 8, // Add bottom margin for rows
  },
  hourButton: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  completedHour: {
    shadowOpacity: 0.2,
  },
  missedHour: {
    shadowOpacity: 0.2,
  },
  futureHour: {
    shadowOpacity: 0.05,
  },
  currentHour: {
    shadowOpacity: 0.2,
  },
  hourText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  completedHourText: {
    color: '#FFFFFF',
  },
  futureHourText: {
    fontWeight: '500',
  },
  currentHourText: {
    fontWeight: '700',
  },
  statusContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsCard: {
    padding: 20, // Reduced from 24 to make it slightly smaller
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
});
