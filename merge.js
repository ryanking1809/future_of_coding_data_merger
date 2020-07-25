const fg = require("fast-glob");
const fs = require("fs");

const exportFolderName = "foc_export"

// merge files containing messages withing the channel folders
const folderPaths = fg.sync([`${exportFolderName}/*`], {onlyDirectories: true});
let allMessages = [];
for (const folderPath of folderPaths) {
    let messages = []
    const folderName = folderPath.split("/")[1];
    const paths = fg.sync([`${folderPath}/*.json`]);
    for (const path of paths) {
        const jsonData = fs.readFileSync(path);
        const jsData = JSON.parse(jsonData).map((m) => ({
			...m,
			channel: folderName,
		}));
        messages.push(...jsData)
        allMessages.push(...jsData);
    }
    fs.writeFile(`merged_data/messages/${folderName}.json`, JSON.stringify(messages, null, 2), 'utf8', err => {
        if (err) {
            console.error(err)
        } else {
            console.log(`merged_data/messages/${folderName}.json success!`);
        }
    })
}
fs.writeFile(
	`merged_data/messages.json`,
	JSON.stringify(allMessages, null, 2),
	"utf8",
	(err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`merged_data/messages.json success!`);
		}
	}
);

// copy other json files
const jsonPaths = fg.sync([`${exportFolderName}/*.json`]);
for (const jsonPath of jsonPaths) {
    const fileName = jsonPath.split("/")[1];
    fs.copyFile(jsonPath, `merged_data/${fileName}`, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`merged_data/${fileName} success!`);
		}
	});
}
