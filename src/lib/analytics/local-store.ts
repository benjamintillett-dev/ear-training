import type { Attempt, SessionSummary } from './types.js';
import type { AnalyticsStore } from './store.js';

const ATTEMPTS_KEY = 'ear_attempts';
const SESSIONS_KEY = 'ear_sessions';

function loadJSON<T>(key: string): T[] {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

export class LocalAnalyticsStore implements AnalyticsStore {
	private attempts: Attempt[];
	private sessions: SessionSummary[];

	constructor() {
		this.attempts = loadJSON<Attempt>(ATTEMPTS_KEY);
		this.sessions = loadJSON<SessionSummary>(SESSIONS_KEY);
	}

	saveAttempts(attempts: Attempt[]): void {
		this.attempts.push(...attempts);
		localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(this.attempts));
	}

	saveSession(session: SessionSummary): void {
		// Upsert — update existing if same sessionId (e.g. incomplete → complete)
		const idx = this.sessions.findIndex((s) => s.sessionId === session.sessionId);
		if (idx >= 0) {
			this.sessions[idx] = session;
		} else {
			this.sessions.push(session);
		}
		localStorage.setItem(SESSIONS_KEY, JSON.stringify(this.sessions));
	}

	getAttempts(since?: number, until?: number): Attempt[] {
		return this.attempts.filter((a) => {
			if (since && a.timestamp < since) return false;
			if (until && a.timestamp > until) return false;
			return true;
		});
	}

	getAttemptsByQuestion(key: string, since?: number): Attempt[] {
		return this.attempts.filter(
			(a) => a.questionKey === key && (!since || a.timestamp >= since)
		);
	}

	getSessions(limit?: number): SessionSummary[] {
		const sorted = [...this.sessions].sort((a, b) => b.timestamp - a.timestamp);
		return limit ? sorted.slice(0, limit) : sorted;
	}

	getSessionAttempts(sessionId: string): Attempt[] {
		return this.attempts.filter((a) => a.sessionId === sessionId);
	}

	clear(): void {
		this.attempts = [];
		this.sessions = [];
		localStorage.removeItem(ATTEMPTS_KEY);
		localStorage.removeItem(SESSIONS_KEY);
	}
}
