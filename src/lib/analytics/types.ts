export interface Attempt {
	id: string;
	sessionId: string;
	timestamp: number;

	// What was asked
	mode: 'interval' | 'interval_piano' | 'harmony' | 'scale_degree';
	questionType: 'interval' | 'chord' | 'scale_degree';
	questionKey: string; // semitones as string, or chord.id
	questionName: string; // denormalized for display
	direction: 'up' | 'down';

	// What was available
	availableKeys: string[];

	// What the user did
	answerKey: string;
	correct: boolean;
	roundIndex: number; // 0-9
}

export interface SessionSummary {
	sessionId: string;
	timestamp: number;
	mode: 'interval' | 'interval_piano' | 'harmony' | 'scale_degree';
	score: number;
	totalRounds: number;
	completed: boolean; // false if abandoned mid-session
}
