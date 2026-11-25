'use client';

import { useAuth } from '@/context/AuthContext';

export function usePermission() {
  const { user } = useAuth();

  const isOwner = user?.role === 'MITRA_OWNER';
  const isStaff = user?.role === 'MITRA_STAFF';

  // Specific permissions
  const canManageVehicles =
    isOwner || !!user?.permissions?.kelolaKendaraan || !!user?.permissions?.manageVehicles;
  const canManageAvailability =
    isOwner ||
    !!user?.permissions?.kelolaKetersediaan ||
    !!user?.permissions?.manageAvailability;
  const canProcessOrders =
    isOwner || !!user?.permissions?.lihatPesanan || !!user?.permissions?.viewBookings;
  const canProcessHandover =
    isOwner || !!user?.permissions?.prosesSerahTerima || !!user?.permissions?.processHandover;
  const canProcessReturn =
    isOwner || !!user?.permissions?.prosesPengembalian || !!user?.permissions?.processReturn;
  const canManageMaintenance =
    isOwner ||
    !!user?.permissions?.kelolaMaintenance ||
    !!user?.permissions?.manageMaintenance;

  // Owner-only sensitive permissions (Staff strictly blocked)
  const canViewFinances = isOwner;
  const canManageExpenses = isOwner;
  const canViewReimbursements = isOwner;
  const canManageBankAccounts = isOwner;
  const canManageTeam = isOwner;
  const canEditBusinessProfile = isOwner;

  return {
    isOwner,
    isStaff,
    canManageVehicles,
    canManageAvailability,
    canProcessOrders,
    canProcessHandover,
    canProcessReturn,
    canManageMaintenance,
    canViewFinances,
    canManageExpenses,
    canViewReimbursements,
    canManageBankAccounts,
    canManageTeam,
    canEditBusinessProfile,
  };
}
