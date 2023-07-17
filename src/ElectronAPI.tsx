
export interface ElectronAPI {
  executeCommand?: (commandString: string) => Promise<string>;
  getOsInfo?: () => Promise<{ cpuUsage: number; ramUsage: string }>;
  getUptime?: () => Promise<number>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
