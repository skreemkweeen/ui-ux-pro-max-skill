export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  streaming?: boolean;
}

export type DeviceMode = "desktop" | "tablet" | "mobile";
export type ViewMode = "preview" | "code";
