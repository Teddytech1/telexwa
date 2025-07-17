let axios = require('axios');
let BodyForm = require('form-data');
let fs = require('fs');
const fetch = require('node-fetch');
let cheerio = require('cheerio');
const { fromBuffer } = require('file-type');

async function CatBox(filePath) {
	try {
		const fileStream = fs.createReadStream(filePath);
		const formData = new BodyForm();
		formData.append('fileToUpload', fileStream);
		formData.append('reqtype', 'fileupload');
		formData.append('userhash', '');
		const response = await axios.post('https://catbox.moe/user/api.php', formData, {
			headers: {
				...formData.getHeaders(),
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error at Catbox uploader:", error);
		return "an error has occurred while uploading to catbox.";
	}
};

module.exports = { CatBox };
