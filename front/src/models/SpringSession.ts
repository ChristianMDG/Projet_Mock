export interface SpringSession {
  primaryId: string;
  sessionId: string;
  creationTime: number;
  lastAccessTime: number;
  maxInactiveInterval: number;
  expiryTime: number;
  principalName: string;
}
