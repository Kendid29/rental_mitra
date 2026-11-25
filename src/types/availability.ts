export type AvailabilityBlockType = 'booking' | 'maintenance' | 'manual_block';

export interface AvailabilityBlock {
  id: string;
  partnerId: string;
  vehicleId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  type: AvailabilityBlockType;
  title: string;
  notes?: string;
  referenceId?: string; // bookingId or maintenanceId
  createdAt: string;
  createdBy?: string;
}

export interface VehicleAvailabilitySchedule {
  vehicleId: string;
  vehicleName: string;
  platNomor: string;
  jenis: 'mobil' | 'motor';
  blocks: AvailabilityBlock[];
}
