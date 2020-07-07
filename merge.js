const fg = require("fast-glob");
const fs = require("fs");

const exportFolderName = "foc_export"

// merge files containing messages withing the channel folders
const folderPaths = fg.sync([`${exportFolderName}/*`], {onlyDirectories: true});
for (const folderPath of folderPaths) {
    let messages = []
    const folderName = folderPath.split("/")[1];
    const paths = fg.sync([`${folderPath}/*.json`]);
    for (const path of paths) {
        const jsonData = fs.readFileSync(path);
        messages.push(...JSON.parse(jsonData))
    }
    fs.writeFile(`merged_data/messages/${folderName}.json`, JSON.stringify(messages, null, 2), 'utf8', err => {
        if (err) {
            console.error(err)
        } else {
            console.log(`merged_data/messages/${folderName}.json success!`);
        }
    })
}

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
