export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

export function formatDateIndo(dateInput: string | Date): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDateShort(dateInput: string | Date): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDateTimeIndo(dateInput: string | Date): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';

  const datePart = formatDateShort(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${datePart}, ${hours}:${minutes} WIB`;
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return value.toLocaleString('id-ID');
}

export function formatPhone(phone: string): string {
  if (!phone) return '-';
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  }
  return '+' + clean;
}

export function maskAccountNumber(acc: string): string {
  if (!acc) return '-';
  if (acc.length <= 4) return acc;
  const start = acc.slice(0, 4);
  const end = acc.slice(-2);
  const maskedLength = Math.max(acc.length - 6, 4);
  return `${start}${'•'.repeat(maskedLength)}${end}`;
}
