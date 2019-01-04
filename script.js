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

function ensureValidOutputCellText(cellTextRef) {
	var outputRegEx = /[0-1x]/;
	// only allowing first char:
	cellTextRef.value = cellTextRef.value[0]; 
	if (!outputRegEx.test(cellTextRef.value)) {
		if (cellTextRef.value == 'X') {
			cellTextRef.value = 'x';
		} else {
			cellTextRef.value = 0;
		}
	}  
}

function addBitCols(tableRef, numBits) {
	for (i = 1; i < tableRef.rows.length; i++) { // for each row ...
		for (j = 0; j < numBits; j++) {
			let newCol = tableRef.rows[i].insertCell(1);
			newCol.setAttribute("data-bitindex", j);
		}
	}
}

function addOutputCols(tableRef, numBits, numOutputs) {
	for (i = 1; i < tableRef.rows.length; i++) { // for each row ...
		for (j = numBits; j < numBits+numOutputs; j++) {
			tableRef.rows[i].insertCell(-1);
			tableRef.rows[i].cells[tableRef.rows[i].cells.length-1].setAttribute("data-outputnum", j); 
		}
	}
}

function textFieldFocusOut() {
	// Removes all table elememnts, then reAdds everything  
	// Might not be the best solution? But easy to implement.
	// Plus, considering its only a few elements its not like speeds an issue.
	let tableRef = document.getElementById("truth-table");
	let outputsContainer = document.getElementById("outputs-container");
	
	let numBits = parseInt(document.getElementById("nBits").value);
	let numOutputs = parseInt(document.getElementById("nOutputs").value);

	let desiredNumRows = Math.pow(2, numBits) + 1; // header counts as a row as well

	// When numOutputs are changed, you don't have to reEnter outputs you already have
	var outputCellIndices = grabOutputCellIndices(tableRef);
	let outputCols = grabOutputValues(tableRef, outputCellIndices);

	removeAllRowsCols(tableRef);
	outputsContainer.innerHTML = ""; // Removes all contents of the outputContainer

	addRows(tableRef,desiredNumRows);
	addIndexCols(tableRef); // currNumRows acts like the previous amount of rows here
	addHeaderCols(tableRef, numBits, numOutputs);
	addBitCols(tableRef, numBits);
	addOutputCols(tableRef, numBits, numOutputs);

	addBinaryValues(tableRef);
	addOutputTextFields(tableRef);
	
	outputCellIndices = grabOutputCellIndices(tableRef);// output cellIndices will be diff if less outputs
	setOutputTextFieldsToPreviousValues(tableRef, outputCols, outputCellIndices);
	
	
	debugger;
	addAllKMapOutputs(outputsContainer, numBits, numOutputs);

	document.getElementById("html")

	//addStickyHeader(tableRef);
	
}
function setOutputTextFieldsToPreviousValues(tableRef, outputValues, outputCellIndices) {
	debugger;
	for (i = 0; i < outputCellIndices.length; i++) {
		let index = outputCellIndices[i];
		for (j = 1; j < tableRef.rows.length; j++) {
			tableRef.rows[j].cells[index].firstElementChild.value = outputValues[index,j-1];
		}
	}
}

function grabOutputCellIndices(tableRef) {
	var outputCellIndices = new Array();
	for (i = 0; i < tableRef.rows[0].cells.length; i++) {
		if (tableRef.rows[0].cells[i].dataset.outputnum != null) {
			outputCellIndices.push(i);	
		}
	}
	return outputCellIndices;
}

function grabOutputValues(tableRef, outputCellIndices) { 
	var outputArrayValues = new Array(); 
	for (i = 0; i < outputCellIndices.length; i++) {
		let index = outputCellIndices[i];
		for (j = 1; j < tableRef.rows.length; j++) {
			outputArrayValues[i,j-1] = tableRef.rows[j].cells[index].firstElementChild.value;
		}
	}
	return outputArrayValues;
}

function addStickyHeader(tableRef) {
	// TODO: Try to make header sticky!!!
	let stickyHeader = document.createElement("table");
	stickyHeader.insertRow(-1);
	for (i = 1; i < tableRef.rows[0].cells.length; i++) {
		let node = document.createElement("text");
		node.classList.add("standard-border");
		node.innerHTML = tableRef.rows[0].cells[i].innerHTML;
		stickyHeader.rows[0].appendChild(node);
	}
	stickyHeader.classList.add("table-border");
	//stickyHeader.classList.add("standard-border");
	document.body.appendChild(stickyHeader);
	
}

function addBinaryValues(tableRef) {
	var count = 0;
	for (i = 1; i < tableRef.rows.length; i++) {
		for (j = 1; j < tableRef.rows[i].cells.length; j++) {
			// lmao yes, using strings are the best way to represent binary in JS for some reason
			let bitValue = (count).toString(2); // (base 2)
			if (tableRef.rows[i].cells[j].dataset.bitindex != null) {
				let index = tableRef.rows[i].cells[j].dataset.bitindex;
				let value = bitValue[index];
				if (typeof value === "undefined") {
					tableRef.rows[i].cells[j].innerHTML = 0;
				} else {				
					tableRef.rows[i].cells[j].innerHTML = bitValue[(bitValue.length-1)-index];
				}
			}
		}
		count++;
	}
}

function addOutputTextFields(tableRef) {
	for (i = 1; i < tableRef.rows.length; i++) {
		for (j = 1; j < tableRef.rows[i].cells.length; j++) {
			if (tableRef.rows[i].cells[j].dataset.outputnum != null) {
				let textField = document.createElement("input");
				textField.type = "text";
				textField.className = "input";
				textField.value = 0;
				textField.addEventListener("focusout", function() {
					debugger;
					ensureValidOutputCellText(textField);
				});
				tableRef.rows[i].cells[j].appendChild(textField);
			
			}
		}
	}
}

function removeAllRowsCols(tableRef) {
	while(tableRef.rows.length > 0) {
		tableRef.deleteRow(0);
	}
}

function addRows(tableRef, desiredNumRows) { 
	// always starts at 0
	tableRef.insertRow(-1); // header
	for (i = 1; i < desiredNumRows; i++) {
			tableRef.insertRow(-1); // -1 parameter denotes end of table
	}
}

function addIndexCols(tableRef) {
	let numRows = tableRef.rows.length;
	for (i = 0; i < numRows; i++) {
		if (!indexCellsExists(tableRef, i)) {
			let indexNode = document.createElement("th");
			if (i != 0) {
				indexNode.innerHTML = i-1;
			} else {
				indexNode.innerHTML= "\#";
				
			}
			tableRef.rows[i].appendChild(indexNode);
		}
	}
}

function addHeaderCols(tableRef, numBits, numOutputs) {
	let currNumHeaderCols = tableRef.rows[0].cells.length;
	let desiredNumHeaderCols = numBits + numOutputs + 1; // 1 being the first empty cell

        for (i = 1; i <= numBits; i++) { //ignore cell 0
		if (i >= currNumHeaderCols) { // Col does not currently exist
			let newCell = tableRef.rows[0].insertCell(i);
			tableRef.rows[0].cells[i].outerHTML = "<th>" + getCorrespondingLetter(i) + "</th>";
                        tableRef.rows[0].cells[i].setAttribute("data-bitindex", i-1);
		} else { // Col 
			tableRef.rows[0].cells[i].outerHTML = "<th>" + getCorrespondingLetter(i) + "</th>"
                        tableRef.rows[0].cells[i].setAttribute("data-bitindex", i-1);
		}
	}
	for (i = numBits+1; i < numOutputs+numBits+1; i++) {
		let subscriptText = "<span style=\"border: none; font-size: 50%; vertical-align: text-bottom\">" +  (i - numBits) + "</span>";
                let outputOuterHTMLText = "<th style=\" letter-spacing: -5px\">y" + subscriptText  + "</th>";
                if (i >= currNumHeaderCols) { //Col does not currently exist
                	tableRef.rows[0].insertCell(-1);
                        tableRef.rows[0].cells[i].outerHTML = outputOuterHTMLText;
                        tableRef.rows[0].cells[i].setAttribute("data-outputnum", i - numBits);
		} else {
			tableRef.rows[0].cells[i].outerHTML = outputOuterHTMLText;
                        tableRef.rows[0].cells[i].setAttribute("data-outputnum", i - numBits);
		}
	}
		/*document.onscroll = function() {
			let rows = document.getElementById("truth-table").rows;
			for (i = 1; i < rows.length; i++) {
				let offset = rows[0].cells[i].offsetTop;
				console.log(offset);
				let sticky = offset;
				if (document.pageYOffset >= sticky) {
					tableRef.rows[0].cells[i].classList.add("sticky")
				} else {
					tableRef.rows[0].cells[i].classList.remove("sticky")
				}
			};
		}
*/

}

function addAllKMapOutputs(outputContainer, numBits, numOutputs) {
	 for (i = 0; i < numOutputs; i++) {
		 let singleOutputContainer = document.createElement("div");
		 singleOutputContainer.classList.add("flex-container-single-output");
		 singleOutputContainer.appendChild(generateKMapTable(numBits, i));
	
		 // TODO:: Append SOP and POS to singleOutptuContainer
		
		 outputContainer.appendChild(singleOutputContainer);
		 outputContainer.dataset.numtables = i+1;
	 }
}

function generateKMapTable(numBits, outputIndex) {
	let kMapTable = document.createElement("TABLE");
        kMapTable.classList.add("table-border");
        kMapTable.classList.add("standard-border");
	kMapTable.setAttribute("id", "y" + outputIndex);
	
	let subscriptText = "<span style=\"border: none; font-size: 50%; vertical-align: text-bottom\">" +  (outputIndex+1) + "</span>";
	let tableTitle = "<th style=\" letter-spacing: -5px\">y" + subscriptText  + "</th>";

	switch (numBits) {
		case 2:
			// 4 * 4 table //
			for (k = 0; k < 4; k++) {
				let newRow = kMapTable.insertRow(0);
				var numCells;

				if (k == 3) {
					var numCells = 2;
				} else if (k == 2) {
					var numCells = 4;
				} else {
					numCells = 3;
				}
					for (j = 0; j < numCells; j++) {
						newRow.insertCell(0);
				}
			}

			kMapTable.rows[0].cells[0].outerHTML = tableTitle;
			kMapTable.rows[0].cells[1].outerHTML = "<th>A</th>";
			kMapTable.rows[1].cells[0].outerHTML = "<th>B</th>";
			kMapTable.rows[0].cells[1].colSpan = 3;
			kMapTable.rows[1].cells[0].rowSpan = 3;
			
			kMapTable.rows[2].cells[0].innerHTML = "0";
			kMapTable.rows[3].cells[0].innerHTML = "1";

			kMapTable.rows[1].cells[2].innerHTML = "0";
			kMapTable.rows[1].cells[3].innerHTML = "1";

			break;

                case 3:
			for (k = 0; k < 4; k++) {
				let newRow = kMapTable.insertRow(0);
				var numCells;

				if (k == 3) {
					var numCells = 2;
				} else if (k == 2) {
					var numCells = 6;
				} else {
					numCells = 5;
				}
					for (j = 0; j < numCells; j++) {
						newRow.insertCell(0);
				}
			}

			kMapTable.rows[0].cells[0].outerHTML = tableTitle;
			kMapTable.rows[0].cells[1].outerHTML = "<th>AB</th>";
			kMapTable.rows[1].cells[0].outerHTML = "<th>C</th>";
			kMapTable.rows[0].cells[1].colSpan = 5;
			kMapTable.rows[1].cells[0].rowSpan = 3;
			
			kMapTable.rows[1].cells[2].innerHTML = "00";
			kMapTable.rows[1].cells[3].innerHTML = "01";
			kMapTable.rows[1].cells[4].innerHTML = "11";
			kMapTable.rows[1].cells[5].innerHTML = "10";
			
			kMapTable.rows[2].cells[0].innerHTML = "0";
			kMapTable.rows[3].cells[0].innerHTML = "1";

			break;
                case 4:
			for (k = 0; k < 6; k++) {
				let newRow = kMapTable.insertRow(0);
				var numCells;

				if (k == 5) {
					var numCells = 2;
				} else if (k == 4) {
					var numCells = 6;
				} else {
					numCells = 5;
				}
					for (j = 0; j < numCells; j++) {
						newRow.insertCell(0);
				}
			}
			debugger;

			kMapTable.rows[0].cells[0].outerHTML = tableTitle;
			kMapTable.rows[0].cells[1].outerHTML = "<th>AB</th>";
			kMapTable.rows[1].cells[0].outerHTML = "<th>CD</th>";
			kMapTable.rows[0].cells[1].colSpan = 5;
			kMapTable.rows[1].cells[0].rowSpan = 5;
			
			kMapTable.rows[1].cells[2].innerHTML = "00";
			kMapTable.rows[1].cells[3].innerHTML = "01";
			kMapTable.rows[1].cells[4].innerHTML = "11";
			kMapTable.rows[1].cells[5].innerHTML = "10";
			
			kMapTable.rows[2].cells[0].innerHTML = "00";
			kMapTable.rows[3].cells[0].innerHTML = "01";
			kMapTable.rows[4].cells[0].innerHTML = "00";
			kMapTable.rows[5].cells[0].innerHTML = "01";
			break;
	}
	return kMapTable;
}

function indexCellsExists(tableRef, index) {
	return (parseInt(tableRef.rows[index].cells.length) != 0);
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
