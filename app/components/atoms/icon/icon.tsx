import { createElement } from 'react';
import {
	AcademicCapIcon,
	ArrowRightCircleIcon,
	Bars3Icon,
	BookOpenIcon,
	ChartBarIcon,
	ChartBarSquareIcon,
	ChartPieIcon,
	CheckCircleIcon,
	CheckIcon,
	ChevronDownIcon,
	CloudArrowUpIcon,
	CodeBracketIcon,
	CodeBracketSquareIcon,
	CommandLineIcon,
	DocumentIcon,
	ExclamationCircleIcon,
	ExclamationTriangleIcon,
	LockClosedIcon,
	PencilIcon,
	PencilSquareIcon,
	ServerIcon,
	SparklesIcon,
	WrenchIcon,
	WrenchScrewdriverIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';

const iconmapper = (icon: string): React.ElementType => {
	switch (icon) {
		case 'academicCapIcon':
			return AcademicCapIcon;
		case 'arrowRightCircleIcon':
			return ArrowRightCircleIcon;
		case 'bars3Icon':
			return Bars3Icon;
		case 'bookOpenIcon':
			return BookOpenIcon;
		case 'chartBarIcon':
			return ChartBarIcon;
		case 'chartBarSquareIcon':
			return ChartBarSquareIcon;
		case 'chartPieIcon':
			return ChartPieIcon;
		case 'checkCircleIcon':
			return CheckCircleIcon;
		case 'checkIcon':
			return CheckIcon;
		case 'chevronDownIcon':
			return ChevronDownIcon;
		case 'cloudArrowUpIcon':
			return CloudArrowUpIcon;
		case 'codeBracketIcon':
			return CodeBracketIcon;
		case 'codeBracketSquareIcon':
			return CodeBracketSquareIcon;
		case 'commandLineIcon':
			return CommandLineIcon;
		case 'documentIcon':
			return DocumentIcon;
		case 'exclamationCircleIcon':
			return ExclamationCircleIcon;
		case 'exclamationTriangleIcon':
			return ExclamationTriangleIcon;
		case 'lockClosedIcon':
			return LockClosedIcon;
		case 'pencilIcon':
			return PencilIcon;
		case 'pencilSquareIcon':
			return PencilSquareIcon;
		case 'serverIcon':
			return ServerIcon;
		case 'sparklesIcon':
			return SparklesIcon;
		case 'wrenchIcon':
			return WrenchIcon;
		case 'wrenchScrewdriverIcon':
			return WrenchScrewdriverIcon;
		case 'xMarkIcon':
			return XMarkIcon;
		default:
			return DocumentIcon;
	}
};

export const Icon: React.FC<{ icon: string; className?: string }> = ({
	icon,
	className,
}) => {
	return createElement(iconmapper(icon), {
		'aria-hidden': 'true',
		className,
	});
};
