export interface ElectronAPI {
  timewStartSession?: (tag: string) => Promise<string>;
  timewStop?: () => Promise<string>;
  timewTotalToday?: () => Promise<string>;
  timewCurrentTag?: () => Promise<string>;
  timewCurrentTime?: () => Promise<string>;
  timewTagTotal?: (tag: string) => Promise<string>;


  taskAllTags?: () => Promise<string>;
}
