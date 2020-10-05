
const onChooseFile = function(event, onLoadFileHandler) {
	// https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers

    if (typeof window.FileReader !== 'function')
        throw ("The file API isn't supported on this browser.");
    let input = event.target;
    if (!input)
        throw ("The browser does not properly implement the event object");
    if (!input.files)
        throw ("This browser does not support the `files` property of the file input.");
    if (!input.files[0])
        return undefined;
    let file = input.files[0];
    let fr = new FileReader();
    fr.onload = onLoadFileHandler;
    fr.readAsText(file);
};

const downloadRecords = function(fileType, sourceData, selectedFileType) {
  return function() {
	let csvContent = `data:text/${selectedFileType.slice(1)};charset=utf-8,`;

    if (sourceData.length) {
      sourceData.forEach(function(line) {
        csvContent += line + '\r\n';
      });
    }

    let encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };
};

module.exports = {
  onChooseFile: onChooseFile,
  downloadRecords: downloadRecords
};