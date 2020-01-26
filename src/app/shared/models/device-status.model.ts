export interface DeviceStatusModel {
	title: string;
	type: string;
	connectionState: {
		title: string;
		status: boolean;
		time: string;
	};
	temperature: {
		title: string;
		temp: number;
		time: string;
	};
	uptime: {
		title: string;
		timeInWork: string[];
		time: string;
	};
	params?: Array<{
		status: string;
		time: string;
	}>;
}
