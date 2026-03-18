export type TTest = {
	key: string;
};

export const fetchTest = async (): Promise<TTest> => {
	const res = await fetch('/api/test');
	const data = await res.json();
	return data;
};
