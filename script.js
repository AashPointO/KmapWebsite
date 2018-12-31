
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
}

function addRows(tableRef, currNumRows, desiredNumRows) {
	let numCells = tableRef.rows[0].cells.length;
	// Iterates for each extra row needed
	// Tags on the index to the start of the row for good measure
	for (i = currNumRows; i < desiredNumRows; i++) {
		let newRow = tableRef.insertRow(-1); // Insert a row at the end of the table, and grab reference to given row
	}
}

function addIndexCols(tableRef, indexFirstRowAdded) {
	for (row = indexFirstRowAdded; row < tableRef.rows.length; row++) {
		let indexNode = document.createElement("th");
		indexNode.innerHTML = row;
		tableRef.rows[row].appendChild(indexNode);
	}

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

function addBitCols(tableRef, numBits, numOutputs) {
	// ** Only adds cols for left half of table //
	let desiredNumBitCols = numBits; // Add 1 for index cell 
	for (currRow = 0; currRow < tableRef.rows.length; currRow++) {
		let currNumBitCols = tableRef.rows[currRow].cells.length - (numOutputs+1);
		// Each row may not necessarily need the same numCols added
		for (i = currNumBitCols; i < desiredNumBitCols; i++) {
			tableRef.rows[currRow].insertCell(1);
		}
	}
}

function bitTextFieldFocusOut() {
	let tableRef = document.getElementById("truth-table");
	let numBitsFieldRef = document.getElementById("nBits");
	let numOutFieldRef = document.getElementById("nOutputs");
	
	let numBits = parseInt(numBitsFieldRef.value);
	let numOutputs = parseInt(numOutFieldRef.value);

	let currNumRows = parseInt(tableRef.rows.length);
	let desiredNumRows = Math.pow(2, numBits) + 1; // header counts as a row as well
	
	if (currNumRows > desiredNumRows) {
		removeRows(tableRef, currNumRows, desiredNumRows);
		removeBitCols(tableRef, numBits, numOutputs);
	} else {
		addRows(tableRef, currNumRows, desiredNumRows);
		addIndexCols(tableRef, currNumRows); // currNumRows acts like the previous amount of rows here
		addBitCols(tableRef, numBits, numOutputs);
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

