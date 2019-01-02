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
	if (!outputRegEx.test(cellTextRef.value)) {
		if (cellTextRef.value == 'X') {
			cellTextRef.value = 'x';
		} else if (cellTextRef.length() > 1) {
			cellTextRef.value = cellTextRef.value[0];
			ensureValidOutputCellText(cellTextRef.value);
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
	let kMapContainerRef = document.getElementById("k-map-container");
	
	let numBits = parseInt(document.getElementById("nBits").value);
	let numOutputs = parseInt(document.getElementById("nOutputs").value);

	let desiredNumRows = Math.pow(2, numBits) + 1; // header counts as a row as well

	removeAllRowsCols(tableRef);
	kMapContainerRef.innerHTML = ""; // Removes all contents of the kMapContainer

	addRows(tableRef,desiredNumRows);
	addIndexCols(tableRef); // currNumRows acts like the previous amount of rows here
	addHeaderCols(tableRef, numBits, numOutputs);
	addBitCols(tableRef, numBits);
	addOutputCols(tableRef, numBits, numOutputs);

	addBinaryValues(tableRef);
	addOutputTextFields(tableRef);
	
	addAllKmaps(kMapContainerRef, numBits, numOutputs);

	document.getElementById("html")

	//addStickyHeader(tableRef);
	
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

function addAllKmaps(kMapContainer, numBits, numOutputs) {
	 for (i = 0; i < numOutputs; i++) {
		 kMapContainer.appendChild(generateKMapTable(numBits, i));
		 kMapContainer.dataset.numtables = i+1;
	 }
		 console.log(kMapContainer.dataset.numtables);
}

function generateKMapTable(numBits, outputIndex) {
	let kMapTable = document.createElement("TABLE");
        kMapTable.classList.add("table-border");
        kMapTable.classList.add("standard-border");
	kMapTable.setAttribute("id", "k" + outputIndex);
        kMapTable.insertRow(0);
        kMapTable.insertRow(1);
        kMapTable.rows[0].insertCell(0);
        kMapTable.rows[0].insertCell(1);
        kMapTable.rows[1].insertCell(0);

	//kMapTable.rows[1].cells[0].style.transform = "rotate(" + -90 + "deg)"; //rotattion!
	kMapTable.rows[0].cells[0].outerHTML = "<th> y" + (outputIndex+1) + "</th>";
        
	switch (numBits) {
		case 2:
			kMapTable.rows[0].cells[1].outerHTML = "<th>A</th>";
			kMapTable.rows[1].cells[0].outerHTML = "<th>B</th>";
			break;
                case 3:
			kMapTable.rows[0].cells[1].outerHTML = "<th>AB</th>";
			kMapTable.rows[1].cells[0].outerHTML = "<th>C</th>";
			break;
                case 4:
			kMapTable.rows[0].cells[1].outerHTML = "<th>AB</th>";
			kMapTable.rows[1].cells[0].outerHTML = "<th>CD</th>";
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
