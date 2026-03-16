export interface Melody {
	title: string;
	direction: 'up' | 'down';
	bpm: number;
	notes: Array<[number, number]>;
}

export const MELODIES: Record<number, Melody[]> = {
	1: [
		{
			title: 'Jaws',
			direction: 'up', bpm: 52,
			notes: [[0,2],[1,2],[0,1.5],[1,1.5],[0,1],[1,1],[0,0.75],[1,0.75]],
		},
		{
			title: 'Pink Panther',
			direction: 'up', bpm: 120,
			notes: [[0,0.5],[1,1.5],[0,1],[1,0.5],[6,0.5],[5,0.5],[4,0.5],[1,1],[0,2]],
		},
	],
	2: [
		{
			title: 'Happy Birthday',
			direction: 'up', bpm: 100,
			notes: [[0,0.5],[0,0.5],[2,1],[0,1],[5,1],[4,2]],
		},
		{
			title: 'Frère Jacques',
			direction: 'up', bpm: 100,
			notes: [[0,1],[2,1],[4,1],[0,1],[0,1],[2,1],[4,1],[0,1]],
		},
		{
			title: 'Silent Night',
			direction: 'up', bpm: 66,
			notes: [[0,1.5],[2,0.5],[0,1],[-3,3],[0,1.5],[2,0.5],[0,1],[-3,3]],
		},
	],
	3: [
		{
			title: 'Smoke on the Water',
			direction: 'up', bpm: 112,
			notes: [[0,1],[3,1],[5,2],[0,1],[3,1],[6,0.5],[5,2.5]],
		},
		{
			title: 'Greensleeves',
			direction: 'up', bpm: 76,
			notes: [[0,1],[3,2],[2,1],[0,2],[-2,1],[-5,3],[-3,1],[-2,2],[0,1],[3,2],[2,1],[0,3]],
		},
		{
			title: 'Hey Jude',
			direction: 'down', bpm: 76,
			notes: [[0,1],[-3,2.5],[-3,1],[-5,1],[-7,1],[-8,2]],
		},
	],
	4: [
		{
			title: 'When the Saints Go Marching In',
			direction: 'up', bpm: 120,
			notes: [[0,1],[4,1],[5,1],[7,3],[0,1],[4,1],[5,1],[7,3]],
		},
		{
			title: "For He's a Jolly Good Fellow",
			direction: 'up', bpm: 120,
			notes: [[0,1],[4,2],[7,1],[9,2],[7,1],[7,3],[5,1],[4,2],[7,1],[9,2],[4,3]],
		},
	],
	5: [
		{
			title: 'Here Comes the Bride',
			direction: 'up', bpm: 80,
			notes: [[0,1.5],[0,0.5],[0,1],[5,2],[3,1],[2,1],[0,3]],
		},
		{
			title: 'Amazing Grace',
			direction: 'up', bpm: 80,
			notes: [[0,1],[5,2],[2,1],[5,1],[2,1],[0,2],[-3,1],[0,1],[5,3]],
		},
		{
			title: 'Auld Lang Syne',
			direction: 'up', bpm: 80,
			notes: [[0,1.5],[0,0.5],[5,1],[0,1],[5,1],[2,1],[0,1.5],[-3,0.5],[-5,1],[-3,1],[0,2]],
		},
	],
	6: [
		{
			title: 'The Simpsons Theme',
			direction: 'up', bpm: 160,
			notes: [[0,0.5],[6,0.5],[5,0.5],[4,0.5],[3,0.5],[2,0.5],[0,0.75],[6,0.5],[5,0.75]],
		},
		{
			title: 'Maria (West Side Story)',
			direction: 'up', bpm: 80,
			notes: [[0,1],[6,1],[7,2],[6,0.5],[7,0.5],[6,0.5],[7,2]],
		},
		{
			title: 'Black Sabbath (intro)',
			direction: 'up', bpm: 60,
			notes: [[0,1],[0,1],[0,1],[6,1.5],[7,0.5],[6,2]],
		},
	],
	7: [
		{
			title: 'Star Wars Theme',
			direction: 'up', bpm: 120,
			notes: [[0,0.5],[0,0.5],[0,1.5],[7,0.5],[3,1],[0,1.5],[7,0.5],[3,1],[0,2]],
		},
		{
			title: 'Twinkle Twinkle Little Star',
			direction: 'up', bpm: 110,
			notes: [[0,1],[0,1],[7,1],[7,1],[9,1],[9,1],[7,2],[5,1],[5,1],[4,1],[4,1],[2,1],[2,1],[0,2]],
		},
		{
			title: "Can't Help Falling in Love",
			direction: 'up', bpm: 72,
			notes: [[0,1],[4,2],[7,1],[9,2],[7,1],[7,1],[7,2],[5,1],[4,2]],
		},
	],
	8: [
		{
			title: 'The Entertainer',
			direction: 'up', bpm: 100,
			notes: [[0,0.5],[1,0.5],[3,1],[1,1],[-1,1],[3,1],[-1,1],[-4,2],[0,0.5],[1,0.5],[3,1],[1,1],[-1,1]],
		},
		{
			title: 'To Love Somebody (Bee Gees)',
			direction: 'up', bpm: 80,
			notes: [[0,1],[8,2],[8,1],[7,1],[7,1],[4,1],[4,1],[3,2]],
		},
	],
	9: [
		{
			title: 'My Bonnie Lies Over the Ocean',
			direction: 'up', bpm: 140,
			notes: [[0,1],[9,2],[9,1],[7,1],[4,3],[0,1],[2,2]],
		},
		{
			title: 'Hush Little Baby',
			direction: 'up', bpm: 80,
			notes: [[0,1],[9,2],[9,1],[7,1],[7,1],[4,1],[4,1],[2,2]],
		},
	],
	10: [
		{
			title: 'Somewhere (West Side Story)',
			direction: 'up', bpm: 60,
			notes: [[0,1],[10,3],[12,1],[10,1],[9,1],[7,3],[9,2]],
		},
		{
			title: 'Star Trek Theme',
			direction: 'up', bpm: 80,
			notes: [[0,1],[10,2],[12,1],[7,1],[9,1],[7,2],[5,3]],
		},
	],
	11: [
		{
			title: "Bali Ha'i (South Pacific)",
			direction: 'up', bpm: 72,
			notes: [[0,1],[11,2.5],[12,0.5],[11,1],[12,3],[7,2],[0,1],[11,3]],
		},
		{
			title: 'Take On Me (a-ha)',
			direction: 'up', bpm: 168,
			notes: [[0,1],[-2,1],[0,1],[-2,1],[-3,1],[-5,1],[-7,2],[-5,1],[-3,1],[-2,2]],
		},
	],
	12: [
		{
			title: 'Somewhere Over the Rainbow',
			direction: 'up', bpm: 80,
			notes: [[0,1],[12,2],[10,1],[7,1.5],[5,0.5],[7,1],[5,1],[3,1],[2,1],[3,1],[5,2]],
		},
		{
			title: 'Wilma! (The Flintstones)',
			direction: 'up', bpm: 100,
			notes: [[0,1],[12,2],[9,1],[12,3],[0,1],[12,2],[9,1],[12,3]],
		},
	],
};
