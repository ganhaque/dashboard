
export interface ElectronAPI {
  executeCommand?: (commandString: string) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
