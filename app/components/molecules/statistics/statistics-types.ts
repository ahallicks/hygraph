export interface IStatistics {
	__typename: 'Statistics';
	contentId: string;
	statTitle: string;
	statContent: string;
	statistics: IStatistic[];
}

export interface IStatistic {
	__typename: 'Statistic';
	contentId: string;
	title: string;
	description: string;
}
