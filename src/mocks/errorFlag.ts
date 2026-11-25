const mockErrorFlags: Record<string, boolean> = {};

export function setMockError(endpointKey: string, shouldFail: boolean): void {
  mockErrorFlags[endpointKey] = shouldFail;
}

export function checkMockError(endpointKey: string): void {
  if (mockErrorFlags[endpointKey]) {
    throw new Error(`[MOCK SIMULATION ERROR] Gagal memproses permintaan pada ${endpointKey}`);
  }
}
