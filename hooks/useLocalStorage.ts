import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SquatData {
  [date: string]: {
    [hour: string]: boolean;
  };
}

export function useLocalStorage() {
  const [squatData, setSquatData] = useState<SquatData>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('squat-tracker-data');
      if (stored) {
        setSquatData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (data: SquatData) => {
    try {
      await AsyncStorage.setItem('squat-tracker-data', JSON.stringify(data));
      setSquatData(data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const toggleSquat = async (date: string, hour: string) => {
    const newData = {
      ...squatData,
      [date]: {
        ...squatData[date],
        [hour]: !squatData[date]?.[hour],
      },
    };
    await saveData(newData);
  };

  const getSquatStatus = (date: string, hour: string): boolean => {
    return squatData[date]?.[hour] || false;
  };

  return {
    squatData,
    toggleSquat,
    getSquatStatus,
  };
}
