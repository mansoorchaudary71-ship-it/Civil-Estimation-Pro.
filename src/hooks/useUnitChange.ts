import { useEffect } from 'react';
import { useSettings, MeasurementSystem } from '../context/SettingsContext';

/**
 * Custom hook to listen for the global 'units-changed' event.
 * Components can use this to perform specific recalculations or state resets
 * when the global unit system (Metric/Imperial) is toggled.
 */
export function useUnitChange(callback: (newUnit: MeasurementSystem) => void) {
  useEffect(() => {
    const handleUnitChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ measurement: MeasurementSystem }>;
      if (customEvent.detail && customEvent.detail.measurement) {
        callback(customEvent.detail.measurement);
      }
    };

    window.addEventListener('units-changed', handleUnitChange);
    return () => {
      window.removeEventListener('units-changed', handleUnitChange);
    };
  }, [callback]);
}
