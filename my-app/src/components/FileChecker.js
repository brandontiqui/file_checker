import React from 'react';
import { Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { TextField } from '@material-ui/core';
import { onChooseFile, downloadRecords } from '../utils/process_file';

class FileChecker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFileType: '.csv',
      numberOfFieldsLabel: '',
      numberOfFieldsError: true,
      numberOfFields: 0,
      correctRecords: [],
      incorrectRecords: []
    };

    this.handleFileTypeChange = this.handleFileTypeChange.bind(this);
    this.handleNumberOfFields = this.handleNumberOfFields.bind(this);
    this.processFile = this.processFile.bind(this);
  }

  handleFileTypeChange(e) {
    this.setState({selectedFileType: e.target.value})
  }

  handleNumberOfFields(e) {
    this.setState({ numberOfFieldsError: false, numberOfFieldsLabel: ''})
    const value = e.target.value;
    if (isNaN(Number(value))) {
      return this.setState({ numberOfFieldsError: true, numberOfFieldsLabel: 'Enter a number'});
    } else if (value.indexOf('.') > -1) {
      return this.setState({ numberOfFieldsError: true, numberOfFieldsLabel: 'Enter a whole number'});
    } else if (value < 1) {
      return this.setState({ numberOfFieldsError: true, numberOfFieldsLabel: 'Enter a positive number'});
    }
    this.setState({ numberOfFields: Number(e.target.value) });
  }

  onFileLoad(elementId, event) {
    const correctNumberOfFields = this.state.numberOfFields;
    const { selectedFileType } = this.state;
    let splitOnSeparator = ',';
    if (selectedFileType === '.tsv') {
      splitOnSeparator = '\t';
    }

    const text = event.target.result;
    const lines = text.split('\n');

    // store correct lines
    const correctRecords = [];
    // store incorrect lines
    const incorrectRecords = [];
    lines.forEach((line, lineIndex) => {
      if (lineIndex === 0 || line === '') return;
      const numberOfFields = line.split(splitOnSeparator).length;
      if (numberOfFields === correctNumberOfFields) {
        correctRecords.push(line);
      } else {
        incorrectRecords.push(line);
      }
    });
    this.setState({ correctRecords, incorrectRecords });
  }

  processFile(e) {
    onChooseFile(e, this.onFileLoad.bind(this, 'contents'));
  }

  render() {
    const { selectedFileType, numberOfFieldsLabel, numberOfFieldsError, correctRecords, incorrectRecords } = this.state;
    return (
      <div>
        <div>
          How many fields should each record contain?
          <TextField label={numberOfFieldsLabel} error={numberOfFieldsError} onChange={this.handleNumberOfFields} />
        </div>
        <br/>
        <FormControl component="fieldset">
          <FormLabel component="legend">File Type</FormLabel>
          <RadioGroup aria-label="filetype" name="filetype1" value={selectedFileType} onChange={this.handleFileTypeChange}>
            <FormControlLabel value=".csv" control={<Radio />} label="CSV" />
            <FormControlLabel value=".tsv" control={<Radio />} label="TSV" />
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          component="label"
          disabled={numberOfFieldsError}
        >
          Upload File
          <input
            type="file"
            style={{ display: "none" }}
            accept={ selectedFileType }
            onChange={this.processFile}
          />
        </Button>
        <Button
          disabled={numberOfFieldsError || !correctRecords.length}
          secondary
          onClick={downloadRecords('correct', correctRecords, selectedFileType)}
        >
          Download correct records
        </Button>
        <Button
          disabled={numberOfFieldsError || !incorrectRecords.length}
          secondary
          onClick={downloadRecords('incorrect', incorrectRecords, selectedFileType)}
        >
          Download incorrect records
        </Button>
      </div>
    );
  }
}

export default FileChecker;
