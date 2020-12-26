import cheerio from 'cheerio-without-node-native';
import _ from 'lodash';

export const parseGradePage = (html) => {
	const $ = cheerio.load(html);
	const rows = $('table > tr');
	const sections = [];
	rows.each(function (idx, el) {
		const cells = $(el).children();
		if (cells[0].name === 'td') {
			if (cells.length === 5) {
				sections.push({
					title: $(cells[0]).text().trim(),
					data: [
						{
							name: $(cells[1]).text().trim(),
							weight: $(cells[2]).text().trim(),
							grade: $(cells[3]).text().trim(),
							comment: $(cells[4]).text().trim(),
						},
					],
				});
			} else if (cells.length === 4) {
				const lastSection = _.last(sections);
				const name = $(cells[0]).text().trim();
				lastSection.data.push({
					name,
					weight: $(cells[1]).text().trim(),
					grade: $(cells[2]).text().trim(),
					comment: $(cells[3]).text().trim(),
					isTotal: name === 'Total',
				});
			}
		}
	});
	return sections;
};

export {};
