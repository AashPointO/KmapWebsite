function checkTextField(fieldId) {
	var regExCheckBounds = RegExp("[1-5]")
	if (regEx.test(document.getElementById(fieldId).value)) {
		document.getElementById(fieldId).value = 1;
	}
}

function ensureValidBounds(Id, minRange, maxRange) {
	if (document.getElementById(Id).value < minRange) {
		document.getElementById(Id).value = minRange;
	} else if ((maxRange - document.getElementById(Id).value) < 0) {
		document.getElementById(Id).value = maxRange;
	}
}

function ensureValidOutput(Id) {
	var outputRegEx = /[0-1x]/;
	if (!outputRegEx.test(document.getElementById(Id).value)) {
		if (document.getElementById(Id).value == 'X') {
			document.getElementById(Id).value = 'x';
		} else {
			document.getElementById(Id).value = 0;
		}
	}

}

function resizeTruthTableInputs(numInputsWanted, currNumInputs, tableId) {
	for (i = currNumInputs; i < numInputsWanted; i++) {
		document.getElementById(tableId).insertRow(numInputs);
	}
}

function resizeTruthTableOutputs(numOutputsWanted, currNumOutputs, table) {
	for (i = currNumOutputs; i < numOutputsWanted; i++) {
		table.insertCell(numOutputs);
	}
}

function removeRows(tableRef, currNumRows, desiredNumRows) {
	// Insert a row at the end of the table, and grab reference to given row
	for (i = currNumRows; i > desiredNumRows; i--) {
		//      tableRef.deleteRow(parseInt(tableRef.rows.length)-1);
		tableRef.deleteRow(i-1);
	}
	return desiredNumRows;

}

function addRows(tableRef, numRows, desiredNumRows) { 
	for (i = numRows; i < desiredNumRows; i++) {
		let newRow = tableRef.insertRow(-1); // -1 parameter denotes end of table
		let colCountAttribute = document.createAttribute("data-cols");
		colCountAttribute.value = 0;
		newRow.setAttributeNode(colCountAttribute);
	}
	return desiredNumRows;
}


function removeBitCols(tableRef, numBits, numOutputs) {
	let desiredNumCols = numBits + numOutputs + 1; // Add 1 for index cell 
	for (currRow = 0; currRow < tableRef.rows.length; currRow++) { // for each row ...
		let currNumCols = tableRef.rows[currRow].cells.length;
		// Each row may not necessarily need the same numCols removed 
		for (col = currNumCols; col > desiredNumCols; col--) {
			tableRef.rows[currRow].deleteCell(1);
		}
	}
}

function addIndexCols(tableRef, numRows) {
	for (i = 0; i < numRows; i++) {
		if (!indexCellsExists(tableRef, i)) {
			tableRef.rows[i].dataset.cols = 1;
			let indexNode = document.createElement("th");
			indexNode.innerHTML = i;
			tableRef.rows[i].appendChild(indexNode);
		}
	}
}

function indexCellsExists(tableRef, index) {
	return (parseInt(tableRef.rows[index].dataset.cols) != 0);
}


function addBitCols(tableRef, currNumBits, desiredNumBits) {
	for (row = 0; row < tableRef.rows.length; row++) { // for each row ...
		for (i = currNumBits; i < desiredNumBits; i++) {
			tableRef.rows[row].insertCell(1);
		}
	}
}

function addOutputCols(tableRef, numBits, desiredNumOutputs) {
	let currNumOutputs = tableRef.rows[0].cells.length - (numBits + 1);
	for (row = 0; row < tableRef.rows.length; row++) { // for each row ...
		for (i = currNumOutputs; i < desiredNumOutputs; i++) {
			tableRef.rows[row].insertCell(i);
		}
	}

}

function bitTextFieldFocusOut() {
	let tableRef = document.getElementById("truth-table");
	
	let numBits = parseInt(document.getElementById("nBits").value);

	let desiredNumRows = Math.pow(2, numBits) + 1; // header counts as a row as well
	if (parseInt(tableRef.dataset.rows) > desiredNumRows) {
		tableRef.dataset.rows = removeRows(tableRef, parseInt(tableRef.dataset.rows), desiredNumRows);
		//removeBitCols(tableRef, numBits, numOutputs);
	} else if (parseInt(tableRef.dataset.rows.length) < desiredNumRows) {
		tableRef.dataset.rows = addRows(tableRef, parseInt(tableRef.dataset.rows), desiredNumRows);
		addIndexCols(tableRef, tableRef.dataset.rows); // currNumRows acts like the previous amount of rows here
		//addBitCols(tableRef, numBits, numOutputs);
	}
}

function outputTextFieldFocusOut() {
	let tableRef = document.getElementById("truth-table");
	let numBitsFieldRef = document.getElementById("nBits");
	let numOutFieldRef = document.getElementById("nOutputs");
	
	let numBits = parseInt(numBitsFieldRef.value);
	let numOutputs = parseInt(numOutFieldRef.value);

	let desiredNumOutputs = parseInt(numOutFieldRef.value);

	let currNumRows = parseInt(tableRef.rows.length);
	let desiredNumRows = Math.pow(2, numBits) + 1; // header counts as a row as well
	if (numOutputs > desiredNumOutputs) {

	} else {
		addOutputCols(tableRef, numBits, desiredNumOutputs);
	}

}

function getCorrespondingLetter(num) {
	switch (num) {
		case 1:
			return "A";
		case 2:
			return "B";
		case 3: 
			return "C";
		case 4:
			return "D";
		case 5:
			return "E";
		case 6:
			return "F";
		default:
			return "NA";
	}
}
