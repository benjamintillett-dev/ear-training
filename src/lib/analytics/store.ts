import type { Attempt, SessionSummary } from './types.js';
import { LocalAnalyticsStore } from './local-store.js';

export interface AnalyticsStore {
	saveAttempts(attempts: Attempt[]): void;
	saveSession(session: SessionSummary): void;
	getAttempts(since?: number, until?: number): Attempt[];
	getAttemptsByQuestion(key: string, since?: number): Attempt[];
	getSessions(limit?: number): SessionSummary[];
	getSessionAttempts(sessionId: string): Attempt[];
	clear(): void;
}

let storeInstance: AnalyticsStore | null = null;

export function getStore(): AnalyticsStore {
	if (!storeInstance) {
		storeInstance = new LocalAnalyticsStore();
	}
	return storeInstance;
}
