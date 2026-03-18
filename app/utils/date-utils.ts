export const formatDate = (
	date: string,
	options?: Intl.DateTimeFormatOptions & { noSuffix?: boolean },
): string => {
	const suffixMap = {
		zero: 'th',
		one: 'st',
		two: 'nd',
		few: 'rd',
		many: 'th',
		other: 'th',
	};
	const pluralRuleOptions: Intl.PluralRulesOptions = {
		type: 'ordinal',
	};
	const pluralRule = new Intl.PluralRules(
		'en-GB',
		pluralRuleOptions,
	);
	const theDate = new Date(date);
	const formattedDate = theDate.toLocaleString('en-GB', {
		weekday: 'short',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		...options,
	});
	const day = theDate.getDate();
	const suffix = pluralRule.select(day);
	const dayWithSuffix = `${day}${suffixMap[suffix] || suffixMap.other}`;

	return !options?.noSuffix
		? formattedDate.replace(`${day}`, dayWithSuffix)
		: formattedDate;
};
