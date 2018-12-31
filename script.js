
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
	
	for (i = currNumRows; i < desiredNumRows; i++) {
		let newRow = tableRef.insertRow(-1); // Insert a row at the end of the table, and grab reference to given row
		let cols = new Array(numCells);
		let indexNode = document.createElement("th");
		indexNode.innerHTML = i;
		tableRef.rows[i].appendChild(indexNode);
		for (j = 1; j < numCells; j++) {
			cols[j] = newRow.insertCell(j);
		}
	}
}

function removeCols(tableRef, currNumCols, desiredNumCols, numOutputs) {
	for (i = currNumCols; i > desiredNumCols; i--){
		for (j = 0; j < tableRef.rows.length; j++) {
			tableRef.rows[j].deleteCell(i - (numOutputs+1));
		}
	}
}

function addCols(tableRef, currNumCols, desiredNumCols, numOutputs) {
	for (i = currNumCols; i < desiredNumCols; i++) { 
		for (j = 0; j < tableRef.rows.length; j++) {
			tableRef.rows[j].insertCell(i - numOutputs);
		}
		let letter = getCorrespondingLetter(i-1);
		tableRef.rows[0].cells[i - numOutputs].outerHTML = "<th>" + letter + "</th>"
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

