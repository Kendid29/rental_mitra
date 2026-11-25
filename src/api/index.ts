import { authApi } from './endpoints/auth';
import { dashboardApi } from './endpoints/dashboard';
import { vehiclesApi } from './endpoints/vehicles';
import { availabilityApi } from './endpoints/availability';
import { bookingsApi } from './endpoints/bookings';
import { handoverApi } from './endpoints/handover';
import { returnsApi } from './endpoints/returns';
import { customersApi } from './endpoints/customers';
import { maintenanceApi } from './endpoints/maintenance';
import { financeApi } from './endpoints/finance';
import { reimbursementsApi } from './endpoints/reimbursements';
import { bankAccountsApi } from './endpoints/bankAccounts';
import { reportsApi } from './endpoints/reports';
import { teamApi } from './endpoints/team';
import { settingsApi } from './endpoints/settings';
import { notificationsApi } from './endpoints/notifications';

/**
 * Unified RentalinAja Mitra API Layer
 * All client components communicate through this interface.
 * When migrating to real backend API, only these endpoint implementations need to be swapped with fetch() calls.
 */
export const api = {
  auth: authApi,
  dashboard: dashboardApi,
  vehicles: vehiclesApi,
  availability: availabilityApi,
  bookings: bookingsApi,
  handover: handoverApi,
  returns: returnsApi,
  customers: customersApi,
  maintenance: maintenanceApi,
  finance: financeApi,
  reimbursements: reimbursementsApi,
  bankAccounts: bankAccountsApi,
  reports: reportsApi,
  team: teamApi,
  settings: settingsApi,
  notifications: notificationsApi,
};

export default api;
