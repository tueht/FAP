import cheerio from 'cheerio-without-node-native';
import moment from 'moment';
import qs from 'qs';

const parseHomePage = (html) => {
	let $ = cheerio.load(html);
	const student = {
		name: $('#ctl00_mainContent_lblStudentName').text(),
		dob: $('#ctl00_mainContent_lblDateOfBirth').text(),
		studentNo: $('#ctl00_mainContent_lblRollNumber').text(),
	};
	const newElements = $('#ctl00_mainContent_divContent li');
	let news = [];
	newElements.each(function (index, value) {
		news.push({
			time: $('.date', value).text().replace('-', '').trim(),
			title: $('a', value).text().trim(),
			id: qs.parse($('a', value).attr('href').split('?')[1]).id,
		});
	});
	const schoolFeeAnn = $('#ctl00_mainContent_divhocphi').text();
	return {
		student,
		news,
		schoolFeeAnn,
	};
};

const parseAttendanceStatus = ($, element, slotIndex) => {
	const text = $(element).text().trim();
	if (text === '-') {
		return {
			slot: slotIndex,
		};
	}
	const tmp = text.split('(Chưa học)');
	if (tmp.length > 1) {
		return {
			status: 'Chưa học',
			subject: tmp[0].trim(),
			slot: slotIndex,
			time: tmp[1].replace('(', '').replace(')', '').trim(),
		};
	}
	const index = text.lastIndexOf('(');
	const status = text.slice(index);
	return {
		subject: text.slice(0, index).trim(),
		status: status.slice(1, status.length - 1),
		slot: slotIndex,
	};
};

const parseSchedulePage = (html) => {
	let $ = cheerio.load(html);
	const rows = $('form tbody tr');
	const slots = [];
	rows.each(function (slotIndex, value) {
		let tds = $('td', value);
		const days = [];
		tds.each(function (index, cell) {
			if (index > 0) {
				days.push(parseAttendanceStatus($, cell, slotIndex + 1));
			}
		});
		slots.push(days);
	});

	const weekNumber = $(
		'#ctl00_mainContent_drpSelectWeek option[selected="selected"]',
	).attr('value');
	// console.log(weekNumber, slots);
	const startOfWeek = moment(weekNumber, 'w');
	const days = Array(7)
		.fill(0)
		.map((__, index) => {
			return {
				date: startOfWeek.clone().add(index, 'd').format(),
				slots: slots.map((d) => d[index]),
			};
		});
	return {
		weekNumber,
		days,
	};
};

const parseTuitionFeePage = (html) => {
	let $ = cheerio.load(html);
	const rows = $('#example tbody tr');
	const invoices = [];
	rows.each(function (index, value) {
		const cells = $(value).children();
		const no = $(cells[0]).text().trim();
		if (no) {
			invoices.push({
				no,
				rollNo: $(cells[1]).text().trim(),
				semester: $(cells[2]).text().trim(),
				invoiceDate: $(cells[3]).text().trim(),
				amount: $(cells[4]).text().trim(),
				note: $(cells[5]).text().trim(),
			});
		}
	});
	return invoices;
};

const parseTotalTranscriptPage = (html) => {
	let $ = cheerio.load(html);
	const rows = $('#ctl00_mainContent_divGrade tbody tr');
	const invoices = [];
	rows.each(function (index, value) {
		const cells = $(value).children();
		const no = $(cells[0]).text().trim();
		if (no) {
			invoices.push({
				no,
				term: $(cells[1]).text().trim(),
				semester: $(cells[2]).text().trim(),
				subjectCode: $(cells[3]).text().trim(),
				prerequisite: $(cells[4]).text().trim(),
				replacedSubject: $(cells[5]).text().trim(),
				subject: $(cells[6]).text().trim(),
				credit: $(cells[7]).text().trim(),
				grade: $(cells[8]).text().trim(),
				status: $(cells[9]).text().trim(),
			});
		}
	});
	return invoices;
};

const parseAttendancePage = (html, params) => {
	let $ = cheerio.load(html);
	const termElements = $('#ctl00_mainContent_divTerm table tr');
	const terms = [];
	termElements.each(function (idx, el) {
		const url = $('a', el).attr('href');
		terms.push({
			name: $(el).text(),
			id: url ? qs.parse(url, {ignoreQueryPrefix: true}).term : null,
		});
	});
	// console.log('terms', terms);

	const courseElements = $('#ctl00_mainContent_divCourse table tr');
	const courses = [];
	courseElements.each(function (idx, el) {
		const url = $('a', el).attr('href');
		const meta = url ? qs.parse(url, {ignoreQueryPrefix: true}) : {};
		const info = $(el).text().trim().split(',bắt đầu từ');

		courses.push({
			name: `${info[0].trim()})`,
			start: info[1].replace(')', '').trim(),
			id: meta.course,
			termId: meta.term,
		});
	});
	// console.log('cou', courses);
	const resultRowElement = $('td[valign="top"]:last-child');
	const attendanceElements = $('tbody tr', resultRowElement);

	const attendances = [];
	attendanceElements.each(function (idx, el) {
		const cells = $(el).children();
		attendances.push({
			no: $(cells[0]).text().trim(),
			date: $(cells[1]).text().trim().split(',')[1].trim(),
			slot: $(cells[2]).text().trim(),
			lecturer: $(cells[3]).text().trim(),
			description: $(cells[4]).text().trim(),
			status: $(cells[5]).text().trim(),
			note: $(cells[6]).text().trim(),
		});
	});

	const activeCourse = courses.find((el) => !el.id);
	if (activeCourse) {
		activeCourse.attendances = attendances;
		activeCourse.summary = $('tfoot', resultRowElement).text().trim();
		if (!activeCourse.id) {
			activeCourse.id = params.courseId;
		}
	}

	const activeTerm = terms.find((el) => !el.id);
	if (activeTerm) {
		activeTerm.courses = courses;
		if (!activeTerm.id) {
			activeTerm.id = courses.find((e) => e.termId)?.termId;
		}
	}
	terms.reverse();
	return terms;
};

const parseNewPage = (html, newItem) => {
	let $ = cheerio.load(html);
	const htmlText = $('#aspnetForm table').html();
	return {
		html: htmlText,
		newItem,
	};
};

export {
	parseHomePage,
	parseSchedulePage,
	parseTuitionFeePage,
	parseTotalTranscriptPage,
	parseAttendancePage,
	parseNewPage,
};
