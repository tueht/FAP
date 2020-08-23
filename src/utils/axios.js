import axios from 'axios';
import {LOGIN_ENDPOINT} from './api';

export const defaultHeaders = {
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
	Connection: 'keep-alive',
	Accept:
		'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
	'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
	Host: 'fap.fpt.edu.vn',
	Referer: LOGIN_ENDPOINT,
	'Upgrade-Insecure-Requests': 1,
	'Cache-Control': 'max-age=0',
};

const instance = axios.create({
	headers: defaultHeaders,
});

export default instance;
