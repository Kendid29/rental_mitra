export async function simulatedDelay(min = 250, max = 500): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const simulateDelay = simulatedDelay;
