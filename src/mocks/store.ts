import {
  PartnerBusiness,
  AuthUser,
  Vehicle,
  Customer,
  Booking,
  HandoverChecklist,
  ReturnInspection,
  MaintenanceRecord,
  AvailabilityBlock,
  IncomeLedgerEntry,
  ExpenseEntry,
  Reimbursement,
  BankAccount,
  NotificationItem,
  CreateVehicleInput,
  CreateMaintenanceInput,
  PartnerReadinessStatus,
} from '@/types';
import {
  SEED_PARTNERS,
  SEED_USERS,
  SEED_VEHICLES,
  SEED_CUSTOMERS,
  SEED_BOOKINGS,
  SEED_MAINTENANCE,
  SEED_INCOME,
  SEED_EXPENSES,
  SEED_REIMBURSEMENTS,
  SEED_NOTIFICATIONS,
} from './seed';
import { isBrowser, loadFromLocalStorage, saveToLocalStorage, STORE_KEY } from './storage';
import { isDateRangeOverlap, calculatePlatformCommission, calculateNetPartnerRevenue } from '@/lib/calculations';

interface MockStoreState {
  partners: PartnerBusiness[];
  users: AuthUser[];
  vehicles: Vehicle[];
  customers: Customer[];
  bookings: Booking[];
  handovers: HandoverChecklist[];
  returns: ReturnInspection[];
  maintenance: MaintenanceRecord[];
  availabilityBlocks: AvailabilityBlock[];
  income: IncomeLedgerEntry[];
  expenses: ExpenseEntry[];
  reimbursements: Reimbursement[];
  notifications: NotificationItem[];
  currentSession: {
    userId: string;
    partnerId: string;
    token: string;
  } | null;
}

function getInitialState(): MockStoreState {
  // Generate initial availability blocks from bookings and maintenance
  const initialBlocks: AvailabilityBlock[] = [];

  SEED_BOOKINGS.forEach((b) => {
    if (b.status !== 'dibatalkan') {
      initialBlocks.push({
        id: `blk-bk-${b.id}`,
        partnerId: b.partnerId,
        vehicleId: b.vehicleId,
        startDate: b.tanggalMulai,
        endDate: b.tanggalSelesai,
        type: 'booking',
        title: `Sewa #${b.bookingNumber} (${b.customer.nama})`,
        referenceId: b.id,
        createdAt: b.createdAt,
      });
    }
  });

  SEED_MAINTENANCE.forEach((m) => {
    if (m.status !== 'dibatalkan' && m.status !== 'selesai') {
      initialBlocks.push({
        id: `blk-maint-${m.id}`,
        partnerId: m.partnerId,
        vehicleId: m.vehicleId,
        startDate: m.tanggalMulai,
        endDate: m.estimasiSelesai,
        type: 'maintenance',
        title: `Servis: ${m.jenisPerawatan}`,
        referenceId: m.id,
        createdAt: m.createdAt,
      });
    }
  });

  // Extract initial bank accounts from partners
  return {
    partners: [...SEED_PARTNERS],
    users: [...SEED_USERS],
    vehicles: [...SEED_VEHICLES],
    customers: [...SEED_CUSTOMERS],
    bookings: [...SEED_BOOKINGS],
    handovers: [],
    returns: [],
    maintenance: [...SEED_MAINTENANCE],
    availabilityBlocks: initialBlocks,
    income: [...SEED_INCOME],
    expenses: [...SEED_EXPENSES],
    reimbursements: [...SEED_REIMBURSEMENTS],
    notifications: [...SEED_NOTIFICATIONS],
    currentSession: {
      userId: 'usr-m1-owner',
      partnerId: 'mitra-01',
      token: 'mock-jwt-nusantara-owner-token',
    },
  };
}

class MockStore {
  private state: MockStoreState;

  constructor() {
    this.state = getInitialState();
    if (isBrowser()) {
      const persisted = loadFromLocalStorage<MockStoreState | null>(STORE_KEY, null);
      if (persisted && persisted.partners && persisted.vehicles) {
        this.state = persisted;
      } else {
        saveToLocalStorage(STORE_KEY, this.state);
      }
    }
  }

  private persist(): void {
    if (isBrowser()) {
      saveToLocalStorage(STORE_KEY, this.state);
    }
  }

  public resetToDefault(): void {
    this.state = getInitialState();
    this.persist();
  }

  // ==========================================
  // AUTH & SESSION
  // ==========================================
  public getSession() {
    return this.state.currentSession;
  }

  public setSession(userId: string, partnerId: string, token: string) {
    this.state.currentSession = { userId, partnerId, token };
    this.persist();
  }

  public clearSession() {
    this.state.currentSession = null;
    this.persist();
  }

  public getCurrentUser(): AuthUser | null {
    if (!this.state.currentSession) return null;
    return (
      this.state.users.find((u) => u.id === this.state.currentSession?.userId) ||
      this.state.users[0]
    );
  }

  public getCurrentPartner(): PartnerBusiness {
    const partnerId = this.state.currentSession?.partnerId || 'mitra-01';
    const partner = this.state.partners.find((p) => p.id === partnerId);
    return partner || this.state.partners[0];
  }

  public switchActivePartner(partnerId: string): void {
    const partner = this.state.partners.find((p) => p.id === partnerId);
    if (!partner) throw new Error(`Mitra dengan ID ${partnerId} tidak ditemukan`);

    // Pick the owner for this partner
    const owner = this.state.users.find(
      (u) => u.partnerId === partnerId && u.role === 'MITRA_OWNER'
    );
    const userId = owner ? owner.id : 'usr-m1-owner';

    this.state.currentSession = {
      userId,
      partnerId,
      token: `mock-jwt-${partnerId}-token`,
    };
    this.persist();
  }

  public getUserByEmail(email: string): AuthUser | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  // ==========================================
  // PARTNERS & BANK ACCOUNTS
  // ==========================================
  public getPartnerById(partnerId: string): PartnerBusiness | undefined {
    return this.state.partners.find((p) => p.id === partnerId);
  }

  public updatePartnerProfile(partnerId: string, updates: Partial<PartnerBusiness>): PartnerBusiness {
    const idx = this.state.partners.findIndex((p) => p.id === partnerId);
    if (idx === -1) throw new Error('Mitra tidak ditemukan');

    // Partner cannot modify cooperationStatus or verificationStatus
    const { cooperationStatus, verificationStatus, ...allowedUpdates } = updates;
    void cooperationStatus;
    void verificationStatus;

    this.state.partners[idx] = {
      ...this.state.partners[idx],
      ...allowedUpdates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.state.partners[idx];
  }

  public getBankAccounts(partnerId: string): BankAccount[] {
    const partner = this.getPartnerById(partnerId);
    return partner ? partner.bankAccounts : [];
  }

  public addBankAccount(partnerId: string, account: Omit<BankAccount, 'id' | 'partnerId' | 'createdAt'>): BankAccount {
    const partner = this.getPartnerById(partnerId);
    if (!partner) throw new Error('Mitra tidak ditemukan');

    const newAccount: BankAccount = {
      ...account,
      id: `acc-${Date.now()}`,
      partnerId,
      createdAt: new Date().toISOString(),
    };

    if (newAccount.isPrimary) {
      partner.bankAccounts.forEach((a) => (a.isPrimary = false));
    } else if (partner.bankAccounts.length === 0) {
      newAccount.isPrimary = true;
    }

    partner.bankAccounts.push(newAccount);
    this.persist();
    return newAccount;
  }

  public updateBankAccount(partnerId: string, accountId: string, updates: Partial<BankAccount>): BankAccount {
    const partner = this.getPartnerById(partnerId);
    if (!partner) throw new Error('Mitra tidak ditemukan');

    const acc = partner.bankAccounts.find((a) => a.id === accountId);
    if (!acc) throw new Error('Rekening tidak ditemukan');

    if (updates.isPrimary) {
      partner.bankAccounts.forEach((a) => (a.isPrimary = false));
    }

    Object.assign(acc, updates);
    this.persist();
    return acc;
  }

  public deleteBankAccount(partnerId: string, accountId: string): void {
    const partner = this.getPartnerById(partnerId);
    if (!partner) throw new Error('Mitra tidak ditemukan');

    if (partner.bankAccounts.length <= 1) {
      throw new Error('Tidak dapat menghapus satu-satunya rekening bank. Anda harus memiliki minimal 1 rekening penerima.');
    }

    const target = partner.bankAccounts.find((a) => a.id === accountId);
    partner.bankAccounts = partner.bankAccounts.filter((a) => a.id !== accountId);

    if (target?.isPrimary && partner.bankAccounts.length > 0) {
      partner.bankAccounts[0].isPrimary = true;
    }
    this.persist();
  }

  // ==========================================
  // VEHICLES
  // ==========================================
  public getVehicles(partnerId: string): Vehicle[] {
    return this.state.vehicles.filter((v) => v.partnerId === partnerId);
  }

  public getVehicleById(partnerId: string, vehicleId: string): Vehicle | undefined {
    return this.state.vehicles.find((v) => v.partnerId === partnerId && v.id === vehicleId);
  }

  public createVehicle(partnerId: string, input: CreateVehicleInput): Vehicle {
    const newVehicle: Vehicle = {
      ...input,
      id: input.id || `veh-${Date.now()}`,
      partnerId,
      rating: 5.0,
      totalUlasan: 0,
      totalPenyewaan: 0,
      status: input.status || 'tersedia',
      publikasiStatus: input.publikasiStatus || 'aktif',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.vehicles.unshift(newVehicle);
    this.persist();
    return newVehicle;
  }

  public updateVehicle(partnerId: string, vehicleId: string, updates: Partial<Vehicle>): Vehicle {
    const idx = this.state.vehicles.findIndex((v) => v.partnerId === partnerId && v.id === vehicleId);
    if (idx === -1) throw new Error('Kendaraan tidak ditemukan atau tidak memiliki izin akses');

    this.state.vehicles[idx] = {
      ...this.state.vehicles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.state.vehicles[idx];
  }

  public deleteVehicle(partnerId: string, vehicleId: string): void {
    const vehicle = this.getVehicleById(partnerId, vehicleId);
    if (!vehicle) throw new Error('Kendaraan tidak ditemukan');

    // Validate if vehicle is currently rented
    const activeBooking = this.state.bookings.find(
      (b) => b.partnerId === partnerId && b.vehicleId === vehicleId && b.status === 'berjalan'
    );
    if (activeBooking) {
      throw new Error('Kendaraan sedang disewa aktif. Selesaikan atau tunggu pengembalian sebelum menghapus unit.');
    }

    this.state.vehicles = this.state.vehicles.filter(
      (v) => !(v.partnerId === partnerId && v.id === vehicleId)
    );
    this.persist();
  }

  // ==========================================
  // AVAILABILITY & COLLISION DETECTION
  // ==========================================
  public getAvailabilityBlocks(partnerId: string, vehicleId?: string): AvailabilityBlock[] {
    let blocks = this.state.availabilityBlocks.filter((b) => b.partnerId === partnerId);
    if (vehicleId) {
      blocks = blocks.filter((b) => b.vehicleId === vehicleId);
    }
    return blocks;
  }

  public checkCollision(
    partnerId: string,
    vehicleId: string,
    startDate: string,
    endDate: string,
    excludeBlockId?: string
  ): { hasCollision: boolean; conflictingBlock?: AvailabilityBlock } {
    const blocks = this.getAvailabilityBlocks(partnerId, vehicleId);
    for (const b of blocks) {
      if (excludeBlockId && b.id === excludeBlockId) continue;
      if (isDateRangeOverlap(startDate, endDate, b.startDate, b.endDate)) {
        return { hasCollision: true, conflictingBlock: b };
      }
    }
    return { hasCollision: false };
  }

  public addManualBlock(partnerId: string, vehicleId: string, startDate: string, endDate: string, notes?: string): AvailabilityBlock {
    const collision = this.checkCollision(partnerId, vehicleId, startDate, endDate);
    if (collision.hasCollision) {
      throw new Error(`Jadwal bentrok dengan ${collision.conflictingBlock?.title}`);
    }

    const block: AvailabilityBlock = {
      id: `blk-manual-${Date.now()}`,
      partnerId,
      vehicleId,
      startDate,
      endDate,
      type: 'manual_block',
      title: 'Blokir Manual Mitra',
      notes,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()?.name,
    };

    this.state.availabilityBlocks.push(block);
    this.persist();
    return block;
  }

  public removeAvailabilityBlock(partnerId: string, blockId: string): void {
    const block = this.state.availabilityBlocks.find((b) => b.id === blockId && b.partnerId === partnerId);
    if (!block) throw new Error('Jadwal tidak ditemukan');
    if (block.type === 'booking') {
      throw new Error('Tidak dapat menghapus blokir jadwal penyewaan aktif secara manual.');
    }

    this.state.availabilityBlocks = this.state.availabilityBlocks.filter((b) => b.id !== blockId);
    this.persist();
  }

  // ==========================================
  // BOOKINGS & TRANSACTION LIFECYCLE
  // ==========================================
  public getBookings(partnerId: string): Booking[] {
    return this.state.bookings.filter((b) => b.partnerId === partnerId);
  }

  public getBookingById(partnerId: string, bookingId: string): Booking | undefined {
    return this.state.bookings.find((b) => b.partnerId === partnerId && b.id === bookingId);
  }

  public updateBookingReadiness(
    partnerId: string,
    bookingId: string,
    readinessStatus: PartnerReadinessStatus,
    partnerNotes?: string,
    issueData?: { alasan: string; catatan: string }
  ): Booking {
    const booking = this.getBookingById(partnerId, bookingId);
    if (!booking) throw new Error('Pesanan tidak ditemukan');

    booking.readinessStatus = readinessStatus;
    if (partnerNotes) booking.partnerNotes = partnerNotes;

    const user = this.getCurrentUser();
    const actorName = user ? `${user.name} (${user.role === 'MITRA_OWNER' ? 'Owner' : 'Staff'})` : 'Mitra';

    if (readinessStatus === 'ready') {
      booking.timeline.push({
        status: 'ready',
        label: 'Unit Dikonfirmasi Siap',
        timestamp: new Date().toISOString(),
        actor: actorName,
        notes: partnerNotes || 'Mitra telah memverifikasi kesiapan armada & dokumen',
      });
    } else if (readinessStatus === 'issue_reported' && issueData) {
      booking.reportedIssue = {
        alasan: issueData.alasan,
        catatan: issueData.catatan,
        dilaporkanPada: new Date().toISOString(),
      };
      booking.timeline.push({
        status: 'issue_reported',
        label: `Kendala Dilaporkan: ${issueData.alasan}`,
        timestamp: new Date().toISOString(),
        actor: actorName,
        notes: issueData.catatan,
      });

      // Add notification
      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        partnerId,
        category: 'pesanan',
        title: `Laporan Kendala #${booking.bookingNumber}`,
        message: `Kendala "${issueData.alasan}" telah diajukan ke admin platform.`,
        link: `/bookings/${booking.id}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    booking.updatedAt = new Date().toISOString();
    this.persist();
    return booking;
  }

  // Handover processing
  public completeHandover(partnerId: string, input: Omit<HandoverChecklist, 'id' | 'createdAt'>): HandoverChecklist {
    const booking = this.getBookingById(partnerId, input.bookingId);
    if (!booking) throw new Error('Pesanan tidak ditemukan');

    const handover: HandoverChecklist = {
      ...input,
      id: `ho-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.state.handovers.push(handover);

    // Update booking
    booking.handoverId = handover.id;
    booking.status = 'berjalan';
    booking.timeline.push({
      status: 'berjalan',
      label: 'Serah Terima Kunci Selesai',
      timestamp: handover.createdAt,
      actor: `${handover.namaPetugas} (Petugas)`,
      notes: `KM Awal: ${handover.odometerAwalKm} KM | BBM: ${handover.levelBbmAwalPersen}%`,
    });

    // Update vehicle status
    const vehicle = this.getVehicleById(partnerId, booking.vehicleId);
    if (vehicle) {
      vehicle.status = 'disewa';
      vehicle.odometerKm = handover.odometerAwalKm;
    }

    this.persist();
    return handover;
  }

  public getHandoverByBookingId(partnerId: string, bookingId: string): HandoverChecklist | undefined {
    return this.state.handovers.find((h) => h.partnerId === partnerId && h.bookingId === bookingId);
  }

  // Return inspection processing
  public completeReturn(partnerId: string, input: Omit<ReturnInspection, 'id' | 'createdAt'>): ReturnInspection {
    const booking = this.getBookingById(partnerId, input.bookingId);
    if (!booking) throw new Error('Pesanan tidak ditemukan');

    const retInspection: ReturnInspection = {
      ...input,
      id: `ret-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.state.returns.push(retInspection);

    // Update booking
    booking.returnInspectionId = retInspection.id;
    booking.status = 'selesai';
    booking.timeline.push({
      status: 'selesai',
      label: 'Unit Dikembalikan & Selesai',
      timestamp: retInspection.createdAt,
      actor: `${retInspection.namaPetugas} (Petugas)`,
      notes: `KM Akhir: ${retInspection.odometerAkhirKm} KM | BBM: ${retInspection.levelBbmAkhirPersen}%${
        retInspection.totalBiayaPenyesuaian > 0 ? ` | Penyesuaian: Rp ${retInspection.totalBiayaPenyesuaian.toLocaleString('id-ID')}` : ''
      }`,
    });

    // Update vehicle status
    const vehicle = this.getVehicleById(partnerId, booking.vehicleId);
    if (vehicle) {
      vehicle.status = 'tersedia';
      vehicle.odometerKm = retInspection.odometerAkhirKm;
      vehicle.totalPenyewaan += 1;
    }

    // Post to Income Ledger
    const grossAmount = booking.rincianBiaya.subtotalSewa + (retInspection.biayaKeterlambatan || 0);
    const platformCommission = calculatePlatformCommission(grossAmount, 10);
    const netRevenue = calculateNetPartnerRevenue(grossAmount, platformCommission, 0);

    const incomeEntry: IncomeLedgerEntry = {
      id: `inc-${Date.now()}`,
      partnerId,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicle.nama,
      platNomor: booking.vehicle.platNomor,
      customerName: booking.customer.nama,
      tanggalSelesai: booking.tanggalSelesai,
      hargaSewaKotor: grossAmount,
      komisiPlatform: platformCommission,
      persentaseKomisi: 10,
      penyesuaian: retInspection.totalBiayaPenyesuaian,
      hakBersihMitra: netRevenue,
      statusReimburse: 'belum_dibayar',
      createdAt: new Date().toISOString(),
    };
    this.state.income.unshift(incomeEntry);

    // Create Reimbursement record for admin
    const primaryAccount = this.getBankAccounts(partnerId).find((a) => a.isPrimary) || {
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'Mitra Rental',
    };

    const reimbursement: Reimbursement = {
      id: `rem-${Date.now()}`,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      partnerId,
      customerName: booking.customer.nama,
      vehicleName: booking.vehicle.nama,
      platNomor: booking.vehicle.platNomor,
      periodeSewa: `${booking.tanggalMulai} - ${booking.tanggalSelesai} (${booking.durasiHari} Hari)`,
      totalTransaksiKotor: grossAmount,
      komisiPlatform: platformCommission,
      penyesuaian: retInspection.totalBiayaPenyesuaian,
      nominalBersihMitra: netRevenue,
      bankTujuan: {
        bankName: primaryAccount.bankName,
        accountNumber: primaryAccount.accountNumber,
        accountHolder: primaryAccount.accountHolder,
      },
      status: 'belum_dibayar',
      tanggalPembayaran: null,
      referensiTransfer: null,
      buktiTransferUrl: null,
      catatanAdmin: null,
      createdAt: new Date().toISOString(),
    };
    this.state.reimbursements.unshift(reimbursement);

    booking.reimbursementId = reimbursement.id;
    incomeEntry.reimbursementId = reimbursement.id;

    this.persist();
    return retInspection;
  }

  public getReturnByBookingId(partnerId: string, bookingId: string): ReturnInspection | undefined {
    return this.state.returns.find((r) => r.partnerId === partnerId && r.bookingId === bookingId);
  }

  // ==========================================
  // CUSTOMERS
  // ==========================================
  public getCustomers(partnerId: string): Customer[] {
    return this.state.customers.filter((c) => c.partnerId === partnerId);
  }

  public getCustomerById(partnerId: string, customerId: string): Customer | undefined {
    return this.state.customers.find((c) => c.partnerId === partnerId && c.id === customerId);
  }

  public updateCustomerNotes(partnerId: string, customerId: string, notes: string): Customer {
    const cust = this.getCustomerById(partnerId, customerId);
    if (!cust) throw new Error('Pelanggan tidak ditemukan');
    cust.catatanOperasional = notes;
    this.persist();
    return cust;
  }

  // ==========================================
  // MAINTENANCE
  // ==========================================
  public getMaintenance(partnerId: string): MaintenanceRecord[] {
    return this.state.maintenance.filter((m) => m.partnerId === partnerId);
  }

  public getMaintenanceById(partnerId: string, maintenanceId: string): MaintenanceRecord | undefined {
    return this.state.maintenance.find((m) => m.partnerId === partnerId && m.id === maintenanceId);
  }

  public createMaintenance(partnerId: string, input: CreateMaintenanceInput): MaintenanceRecord {
    const newRecord: MaintenanceRecord = {
      ...input,
      id: `maint-${Date.now()}`,
      partnerId,
      status: input.status || 'sedang_dikerjakan',
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()?.name,
    };

    this.state.maintenance.unshift(newRecord);

    // If status is scheduled or in-progress, mark vehicle as maintenance & create calendar block
    if (newRecord.status === 'sedang_dikerjakan' || newRecord.status === 'dijadwalkan') {
      const vehicle = this.getVehicleById(partnerId, newRecord.vehicleId);
      if (vehicle) {
        vehicle.status = 'maintenance';
      }

      this.state.availabilityBlocks.push({
        id: `blk-maint-${newRecord.id}`,
        partnerId,
        vehicleId: newRecord.vehicleId,
        startDate: newRecord.tanggalMulai,
        endDate: newRecord.estimasiSelesai,
        type: 'maintenance',
        title: `Servis: ${newRecord.jenisPerawatan}`,
        referenceId: newRecord.id,
        createdAt: new Date().toISOString(),
      });
    }

    // Auto post to Operational Expenses
    const expenseEntry: ExpenseEntry = {
      id: `exp-maint-${Date.now()}`,
      nomorPengeluaran: `EXP-M-${Date.now().toString().slice(-4)}`,
      partnerId,
      kategori: 'Maintenance & Servis',
      tanggal: newRecord.tanggalMulai,
      deskripsi: `${newRecord.jenisPerawatan} (${newRecord.vehicleName} - ${newRecord.platNomor}) di ${newRecord.namaBengkel}`,
      nominal: newRecord.biaya,
      metodePembayaran: 'Transfer Bank',
      vehicleId: newRecord.vehicleId,
      vehicleName: newRecord.vehicleName,
      platNomor: newRecord.platNomor,
      buktiFoto: newRecord.fotoNota,
      dicatatOleh: this.getCurrentUser()?.name || 'Staff',
      createdAt: new Date().toISOString(),
    };
    this.state.expenses.unshift(expenseEntry);
    newRecord.linkedExpenseId = expenseEntry.id;

    this.persist();
    return newRecord;
  }

  public updateMaintenanceStatus(partnerId: string, maintenanceId: string, status: MaintenanceRecord['status']): MaintenanceRecord {
    const record = this.getMaintenanceById(partnerId, maintenanceId);
    if (!record) throw new Error('Data maintenance tidak ditemukan');

    record.status = status;
    if (status === 'selesai') {
      record.tanggalSelesaiAktual = new Date().toISOString().split('T')[0];
      const vehicle = this.getVehicleById(partnerId, record.vehicleId);
      if (vehicle) vehicle.status = 'tersedia';

      // Remove availability block
      this.state.availabilityBlocks = this.state.availabilityBlocks.filter(
        (b) => !(b.type === 'maintenance' && b.referenceId === maintenanceId)
      );
    }

    this.persist();
    return record;
  }

  // ==========================================
  // FINANCES (INCOME & EXPENSES)
  // ==========================================
  public getIncomeLedger(partnerId: string): IncomeLedgerEntry[] {
    return this.state.income.filter((i) => i.partnerId === partnerId);
  }

  public getExpenses(partnerId: string): ExpenseEntry[] {
    return this.state.expenses.filter((e) => e.partnerId === partnerId);
  }

  public createExpense(partnerId: string, input: Omit<ExpenseEntry, 'id' | 'nomorPengeluaran' | 'partnerId' | 'createdAt'>): ExpenseEntry {
    const newExpense: ExpenseEntry = {
      ...input,
      id: `exp-${Date.now()}`,
      nomorPengeluaran: `EXP-2026-${Date.now().toString().slice(-4)}`,
      partnerId,
      createdAt: new Date().toISOString(),
    };

    this.state.expenses.unshift(newExpense);
    this.persist();
    return newExpense;
  }

  public deleteExpense(partnerId: string, expenseId: string): void {
    this.state.expenses = this.state.expenses.filter((e) => !(e.partnerId === partnerId && e.id === expenseId));
    this.persist();
  }

  // ==========================================
  // REIMBURSEMENTS
  // ==========================================
  public getReimbursements(partnerId: string): Reimbursement[] {
    return this.state.reimbursements.filter((r) => r.partnerId === partnerId);
  }

  public getReimbursementById(partnerId: string, id: string): Reimbursement | undefined {
    return this.state.reimbursements.find((r) => r.partnerId === partnerId && r.id === id);
  }

  // ==========================================
  // TEAM & STAFF
  // ==========================================
  public getTeamMembers(partnerId: string): AuthUser[] {
    return this.state.users.filter((u) => u.partnerId === partnerId);
  }

  public createTeamMember(partnerId: string, member: Omit<AuthUser, 'id' | 'partnerId' | 'lastActive'>): AuthUser {
    const newMember: AuthUser = {
      ...member,
      id: `usr-${Date.now()}`,
      partnerId,
      lastActive: new Date().toISOString(),
    };

    this.state.users.push(newMember);
    this.persist();
    return newMember;
  }

  public updateTeamMember(partnerId: string, memberId: string, updates: Partial<AuthUser>): AuthUser {
    const user = this.state.users.find((u) => u.partnerId === partnerId && u.id === memberId);
    if (!user) throw new Error('Staf tidak ditemukan');

    Object.assign(user, updates);
    this.persist();
    return user;
  }

  public deleteTeamMember(partnerId: string, memberId: string): void {
    const user = this.state.users.find((u) => u.partnerId === partnerId && u.id === memberId);
    if (!user) throw new Error('Staf tidak ditemukan');
    if (user.role === 'MITRA_OWNER') {
      throw new Error('Tidak dapat menghapus akun Pemilik Bisnis.');
    }

    this.state.users = this.state.users.filter((u) => !(u.partnerId === partnerId && u.id === memberId));
    this.persist();
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  public getNotifications(partnerId: string): NotificationItem[] {
    return this.state.notifications.filter((n) => n.partnerId === partnerId);
  }

  public markNotificationRead(partnerId: string, notificationId: string): void {
    const notif = this.state.notifications.find((n) => n.partnerId === partnerId && n.id === notificationId);
    if (notif) notif.isRead = true;
    this.persist();
  }

  public markAllNotificationsRead(partnerId: string): void {
    this.state.notifications.forEach((n) => {
      if (n.partnerId === partnerId) n.isRead = true;
    });
    this.persist();
  }
}

// Global Singleton Instance
export const mockStore = new MockStore();
