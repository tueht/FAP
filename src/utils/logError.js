import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {CRASH_REPORT_SLACK_WEBHOOK_URL} from '@env';

function logError(name, error) {
	if (!CRASH_REPORT_SLACK_WEBHOOK_URL || __DEV__) {
		return;
	}
	const info = {
		platform: Platform.OS,
		build: DeviceInfo.getBuildNumber(),
		deviceModel: DeviceInfo.getModel(),
		version: DeviceInfo.getVersion(),
		bundleId: DeviceInfo.getBundleId(),
		systemVersion: DeviceInfo.getSystemVersion(),
	};
	const sPayload = {
		text: `[${DeviceInfo.getApplicationName()}][${name}]`,
		attachments: [
			{
				title: 'Device info',
				text: JSON.stringify(info, null, 2),
			},
			{
				title: 'Error',
				text: error,
			},
		],
	};
	const body = `payload=${encodeURI(JSON.stringify(sPayload))}`;
	return fetch(CRASH_REPORT_SLACK_WEBHOOK_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: body,
	}).catch((e) => {});
}

export default logError;
