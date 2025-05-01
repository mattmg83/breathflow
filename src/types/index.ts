export interface BreathingTechnique {
  id: number;
  name: string;
  description: string;
  pattern: string;
  useCases: string;
  evidence: string;
  
  // Timing configuration in seconds
  inhaleTime: number;
  holdInTime: number;
  exhaleTime: number;
  holdOutTime: number;
  
  // Optional fields
  cyclesPerMinute?: number;
  color?: string;
  isCustom?: boolean;
}