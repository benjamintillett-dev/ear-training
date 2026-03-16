import type { Attempt } from './types.js';

export interface QuestionStats {
	questionKey: string;
	questionName: string;
	total: number;
	correct: number;
	accuracy: number; // 0-1
}

export interface AccuracyPoint {
	sessionIndex: number;
	accuracy: number; // 0-1
	timestamp: number;
}

export function computeQuestionStats(attempts: Attempt[]): QuestionStats[] {
	const map = new Map<string, { name: string; total: number; correct: number }>();

	for (const a of attempts) {
		let entry = map.get(a.questionKey);
		if (!entry) {
			entry = { name: a.questionName, total: 0, correct: 0 };
			map.set(a.questionKey, entry);
		}
		entry.total++;
		if (a.correct) entry.correct++;
	}

	return Array.from(map.entries())
		.map(([key, { name, total, correct }]) => ({
			questionKey: key,
			questionName: name,
			total,
			correct,
			accuracy: total > 0 ? correct / total : 0,
		}))
		.sort((a, b) => a.accuracy - b.accuracy);
}

export function computeRecentAccuracy(
	attempts: Attempt[],
	window = 10
): { recent: number; prior: number; delta: number } | null {
	if (attempts.length <= window) return null;

	const recent = attempts.slice(-window);
	const priorSlice = attempts.slice(Math.max(0, attempts.length - window * 2), attempts.length - window);

	const recentAcc = recent.filter((a) => a.correct).length / recent.length;
	const priorAcc = priorSlice.filter((a) => a.correct).length / priorSlice.length;

	return { recent: recentAcc, prior: priorAcc, delta: recentAcc - priorAcc };
}

export function computeAccuracyTrend(attempts: Attempt[]): AccuracyPoint[] {
	// Group by sessionId preserving order
	const sessionIds: string[] = [];
	const sessionMap = new Map<string, Attempt[]>();

	for (const a of attempts) {
		if (!sessionMap.has(a.sessionId)) {
			sessionIds.push(a.sessionId);
			sessionMap.set(a.sessionId, []);
		}
		sessionMap.get(a.sessionId)!.push(a);
	}

	return sessionIds.map((id, i) => {
		const sa = sessionMap.get(id)!;
		const correct = sa.filter((a) => a.correct).length;
		return {
			sessionIndex: i,
			accuracy: sa.length > 0 ? correct / sa.length : 0,
			timestamp: sa[0].timestamp,
		};
	});
}
