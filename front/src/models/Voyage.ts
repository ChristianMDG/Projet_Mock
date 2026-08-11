import { Base } from './Base';
import { Koperative } from './Koperative';
import { Route } from './Route';
import { Gare } from './Gare';
import { Crafter } from './Crafter';
import { Chauffeur } from './Chauffeur';
import { Classe } from './Classe';
import { RecurrenceTypeEnum, VoyageStatusEnum } from './enums';

export interface Voyage extends Base {
  koperative?: Koperative;
  route?: Route;
  classe?: Classe;
  departureGare?: Gare;
  arrivalGare?: Gare;
  crafter?: Crafter;
  chauffeur?: Chauffeur;
  departureTime: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  availableSeats?: number;
  pricePerSeat: number;
  status?: VoyageStatusEnum;
  description?: string;

  // Recurrence fields
  recurrenceType?: RecurrenceTypeEnum;
  customInterval?: number;
  weekdays?: string;
  monthlyDates?: string;
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  isTemplate?: boolean;
  parentTemplate?: Voyage;
  generatedInstances?: Voyage[];
}

// OOP-like static methods and utilities for Voyage management
export class VoyageManager {
  /**
   * Create a new voyage instance with default values
   */
  static createNew(koperativeId: number): Partial<Voyage> {
    return {
      koperative: { id: koperativeId } as Koperative,
      recurrenceType: RecurrenceTypeEnum.ONE_OFF,
      status: VoyageStatusEnum.SCHEDULED,
      availableSeats: 0,
      pricePerSeat: 0,
      isTemplate: false,
    };
  }

  /**
   * Convert voyage to scheduling format for API
   */
  static toScheduleFormat(
    voyage: Partial<Voyage>,
    additionalData: {
      weekdays?: number[];
      monthlyDates?: number[];
      recurrenceStartDate?: string;
      recurrenceEndDate?: string;
    } = {},
  ): Record<string, unknown> {
    return {
      voyageId: voyage.id,
      koperativeId: voyage.koperative?.id,
      routeId: voyage.route?.id,
      departureGareId: voyage.departureGare?.id,
      arrivalGareId: voyage.arrivalGare?.id,
      crafterId: voyage.crafter?.id,
      chauffeurId: voyage.chauffeur?.id,
      classeId: voyage.classe?.id,
      departureTime: voyage.departureTime,
      estimatedArrivalTime: voyage.estimatedArrivalTime,
      availableSeats: voyage.availableSeats,
      pricePerSeat: voyage.pricePerSeat,
      status: voyage.status,
      description: voyage.description,
      recurrenceType: voyage.recurrenceType,
      customInterval: voyage.customInterval,
      weekdays: additionalData.weekdays,
      monthlyDates: additionalData.monthlyDates,
      recurrenceStartDate: additionalData.recurrenceStartDate,
      recurrenceEndDate: additionalData.recurrenceEndDate,
    };
  }

  /**
   * Parse weekdays from string format
   */
  static parseWeekdays(weekdays?: string): number[] {
    if (!weekdays) return [];
    try {
      return JSON.parse(weekdays);
    } catch {
      return [];
    }
  }

  /**
   * Parse monthly dates from string format
   */
  static parseMonthlyDates(monthlyDates?: string): number[] {
    if (!monthlyDates) return [];
    try {
      return JSON.parse(monthlyDates);
    } catch {
      return [];
    }
  }

  /**
   * Check if voyage is recurring
   */
  static isRecurring(voyage: Partial<Voyage>): boolean {
    return voyage.recurrenceType !== RecurrenceTypeEnum.ONE_OFF;
  }

  /**
   * Check if voyage is a template
   */
  static isTemplate(voyage: Partial<Voyage>): boolean {
    return Boolean(voyage.isTemplate);
  }

  /**
   * Validate voyage for scheduling
   */
  static validate(voyage: Partial<Voyage>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!voyage.departureGare?.id) {
      errors.push('Departure station is required');
    }

    if (!voyage.arrivalGare?.id) {
      errors.push('Arrival station is required');
    }

    if (!voyage.crafter?.id) {
      errors.push('Vehicle is required');
    }

    if (!voyage.chauffeur?.id) {
      errors.push('Driver is required');
    }

    if (!voyage.departureTime) {
      errors.push('Departure time is required');
    }

    if (!voyage.pricePerSeat || voyage.pricePerSeat <= 0) {
      errors.push('Price per seat must be greater than 0');
    }

    if (!voyage.availableSeats || voyage.availableSeats <= 0) {
      errors.push('Available seats must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
