function checkTextField(fieldId) {
	var regExCheckBounds = RegExp("[1-5]")
	if (regEx.test(document.getElementById(fieldId).value)) {
		document.getElementById(fieldId).value = 1;
	}
}

function binaryToDecimal(binaryValue) {
	return parseInt(binaryValue, 2);
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
	} else if (parseInt(cellTextRef.value) > 1){
		cellTextRef.value = 1;
	} else {
		cellTextRef.value = 0;
	}
} 
nOutputsTextFieldFocusOut();
} 

function  assignIndividualValuesToKMaps(outputsContainer, tableRef, numOutputs) {
let indexFirstOutput = tableRef.rows[0].cells.length - numOutputs;
let kMaps = outputsContainer.childNodes;
for (var a = 0; a < kMaps.length; a++) { // For each component of Flex-Container
		var outputsArray = new Array(tableRef.rows.length);
		
		let outputIndex = indexFirstOutput + a;

		for (var i = 0; i < tableRef.rows.length-1; i++) { // Grabs Output Values
			outputsArray[i] = tableRef.rows[i+1].cells[outputIndex].firstElementChild.value;
			
		}
		for (var i = 0; i < kMaps[a].firstChild.rows.length; i++) { // For Each Row of KMap
			for (var j = 0; j < kMaps[a].firstChild.rows[i].cells.length; j++) { // For Each Col of K Map
				var decimalVal = kMaps[a].firstChild.rows[i].cells[j].dataset.decimalvalue;
				if (kMaps[a].firstChild.rows[i].cells[j].dataset.decimalvalue != null) {
					kMaps[a].firstChild.rows[i].cells[j].innerText = outputsArray[parseInt(decimalVal)];
				}
			}
		}
}
}

function autoIndentOutputTextField(from, to) {
if (from.value.length==from.getAttribute("maxlength")) {
	to.focus();
}
}	


function assignBitsToTable(tableRef) {
for (var i = 1; i < tableRef.rows.length; i++) {
	tableRef.rows[i] = assignBitsToRow(tableRef.rows[i]);
}
return tableRef;
}


function assignBitsToRow(singleRow) {
// Binary is best represented as string in JS...
// ...
// ...
// ...
// JS is dum
let decimalValue = parseInt(singleRow.cells[0].dataset.decimalvalue);
let binaryRepresentation = decimalValue.toString(2); // base 2
for (var j = 1; j < singleRow.cells.length; j++) {
	if (singleRow.cells[j].dataset.bitindex != null) {
		let index = singleRow.cells[j].dataset.bitindex;
		let value = binaryRepresentation[index];
		if (typeof value === "undefined") {
			singleRow.cells[j].innerHTML = 0;
		} else {
			singleRow.cells[j].innerHTML = binaryRepresentation[(binaryRepresentation.length-1)-index];
		}
	}
}
return singleRow;
}

function addOutputColTextFieldsToTable(tableRef) {

for (var i = 1; i < tableRef.rows.length; i++) {
	tableRef.rows[i] = addOutputColTextFieldsToRow(tableRef.rows[i]);
}

//	tableRef = addAutoIndentEventListenersForTable(tableRef);

return tableRef;

}

function addAutoIndentEventListenersForTable(tableRef) {
for (var i = 1; i < tableRef.rows.length; i++) {
	for (var j = 1; j < tableRef.rows[i].cells.length; j++) {
		var nextRow = i + 1;
		var nextCol = j;
		if (nextRow >= tableRef.rows.length) {
			nextRow = 1;
			nextCol++;
			if (nextCol >= tableRef.rows[0].cells.length) {
				return tableRef;
			}
		}
		if (tableRef.rows[i].cells[j].dataset.outputindex != null) {
			tableRef.rows[i].cells[j].firstElementChild.addEventListener("focusout", function() {
				autoIndentOutputTextField(tableRef.rows[i].cells[j].firstElementChild, tableRef.rows[nextRow].cells[nextCol].firstElementChild);
			});
		}
	}
}
}

function addOutputColTextFieldsToRow(singleRow) {
for (var i = 1; i < singleRow.cells.length; i++) {
	if ((singleRow.cells[i].dataset.outputindex != null) && (!singleRow.cells[i].hasChildNodes())) {
		let textNode = document.createElement("INPUT");
		textNode.setAttribute("type", "text");
		textNode.defaultValue = 0;
		textNode.maxLength= 1;
		singleRow.cells[i].appendChild(textNode);
		textNode.addEventListener("focusout", function() {
			ensureValidOutputCellText(textNode)
		});
		
	}
}
return singleRow;
}

function resizeRows(tableRef, desiredNumBits) {
// Rows only need to be resized if numBits change, not numOutputs

var currNumRows = tableRef.rows.length;
let desiredNumRows = Math.pow(2, desiredNumBits) + 1;

if (desiredNumRows > currNumRows) { // Add rows
	let numRowsToAdd = desiredNumRows - currNumRows;
	for (var i = 0; i < numRowsToAdd; i++) {
		tableRef.insertRow(-1); // Inserts row at end of table
	}
} else if (desiredNumBits < currNumRows) { // Remove rows
	let numRowsToRemove = currNumRows - desiredNumRows;
	for (var i = 0; i < numRowsToRemove; i++) {
		tableRef.deleteRow(-1); // Removes row at end of table
	}
}
return tableRef;
}

function resizeIndexCols(tableRef) {
for (var i = 0; i < tableRef.rows.length; i++) {
	if (tableRef.rows[i].cells.length < 1) {
		tableRef.rows[i].insertCell(0);
		var index = i-1; 
		if (index >= 0) {
			tableRef.rows[i].cells[0].outerHTML = "<th>" + index + "</th>";
		}
		tableRef.rows[i].cells[0].setAttribute("data-decimalvalue", index);
	}
}
return tableRef;
}

function resizeBitCols(tableRef, desiredNumBits) {
// REMEMBER TO RESIZE ROWS FIRST!!!
// if rows are resized after, bunch of empty cells in newly made rows!
// 	-- rows with no cells aren't shown
var currNumBitsOfHeader;
if (tableRef.rows[0].cells.length <= 1) {
	// will only run in initTruthTable
	currNumBitsOfHeader = 0;
} else {
	currNumBitsOfHeader = parseInt(tableRef.rows[0].cells[1].dataset.bitindex) + 1;
}

if (desiredNumBits > currNumBitsOfHeader) { // Add Bit Cols
	for (var i = 0; i < tableRef.rows.length; i++) {
		tableRef.rows[i] = addBitColsOfRow(tableRef.rows[i], desiredNumBits);
	}
} else if (desiredNumBits < currNumBitsOfHeader) {
	for (var i = 0; i < tableRef.rows.length; i++) {
		tableRef.rows[i] = removeBitColsOfRow(tableRef.rows[i], desiredNumBits);
	}
}

return tableRef;
}

function addBitColsOfRow(singleRow, desiredNumBits) {
var initialNumBitsOfRow;
if ((singleRow.cells.length <= 1) || (singleRow.cells[1].dataset.bitindex == null)) {
	// First cell is Index, next cell SHOULD be a Bit cell
	initialNumBitsOfRow = 0;
} else {
	initialNumBitsOfRow = parseInt(singleRow.cells[1].dataset.bitindex) + 1;
}

let numBitsToAddToRow = desiredNumBits - initialNumBitsOfRow;
for (var j = 1; j <= numBitsToAddToRow; j++) {
	let newCell = singleRow.insertCell(1);
	newCell.setAttribute("data-bitindex", initialNumBitsOfRow + (j-1));
}
return singleRow;
}

function removeBitColsOfRow(singleRow, desiredNumBits) {
var initialNumBitsOfRow;
if ((singleRow.cells.length <= 1) || (singleRow.cells[1].dataset.bitindex == null)) {
	// First cell is Index, next cell SHOULD be a Bit cell
	initialNumBitsOfRow = 0;
} else {
	initialNumBitsOfRow = parseInt(singleRow.cells[1].dataset.bitindex) + 1;
}

let numBitsToRemoveFromRow = initialNumBitsOfRow - desiredNumBits;
for (var j = 1; j <= numBitsToRemoveFromRow; j++) {
	singleRow.deleteCell(1);
}

// Re-Assigns indices for each bit:
let indexFirstBit = desiredNumBits; // dont need to add 1 since accounted for in index
for (var b = 0; b < desiredNumBits; b++) {
	singleRow.cells[indexFirstBit - b].dataset.bitindex = b;
}
return singleRow;
}

function resizeOutputCols(tableRef, desiredNumOutputs) {
// REMEMBER TO RESIZE ROWS FIRST!!!
// if rows are resized after, bunch of empty cells in newly made rows!
// 	-- rows with no cells aren't shown
var currNumOutputsHeader;

	for (var i = 0; i < tableRef.rows.length; i++) {
		tableRef.rows[i] = resizeOutputColOfRow(tableRef.rows[i], desiredNumOutputs);
	}

return tableRef;
}

function resizeOutputColOfRow(singleRow, desiredNumOutputs) {
var currNumOutputs;
if (singleRow.cells[singleRow.cells.length - 1].dataset.outputindex != null) {
	currNumOutputs = parseInt(singleRow.cells[singleRow.cells.length - 1].dataset.outputindex) + 1;
} else {
	// Only when Init Truth Table Called
	currNumOutputs = 0;
}

if (desiredNumOutputs > currNumOutputs) { // Add Output Cols
	let numOutputColsToAdd = desiredNumOutputs - currNumOutputs;
	for (var j = 1; j <= numOutputColsToAdd; j++) {
		let newCell = singleRow.insertCell(-1);
		newCell.setAttribute("data-outputindex", currNumOutputs + (j - 1));
	}
} else if (desiredNumOutputs < currNumOutputs) { // Remove Output Cols
	let numOutputColsToRemove = currNumOutputs - desiredNumOutputs;
	for (var j = 1; j <= numOutputColsToRemove; j++) {
		singleRow.deleteCell(-1);
	}
}

return singleRow;
}

function addHeaderLabels(headerRow) {
for (var i = 0; i < headerRow.cells.length; i++) {
	if (headerRow.cells[i].dataset.decimalvalue != null) {
		headerRow.cells[i].outerHTML = "<th data-decimalvalue=\"-1\"> \# </th>";
	} else if (headerRow.cells[i].dataset.bitindex != null) {
		headerRow.cells[i].outerHTML = "<th data-bitindex=\"" + headerRow.cells[i].dataset.bitindex +  "\"> " 
			+ getCorrespondingLetter(i-1) + "</th>";
	} else if (headerRow.cells[i].dataset.outputindex != null) {
		let subscriptText = "<span style=\"border: none; font-size: 50%; vertical-align: text-bottom\">" 
			+ (headerRow.cells[i].dataset.outputindex) + "</span>";
		let outputOuterHTMLText = "<th data-outputindex=\"" + headerRow.cells[i].dataset.outputindex 
			+ "\" style=\" letter-spacing: -5px\">y" + subscriptText  + "</th>";
		headerRow.cells[i].outerHTML = outputOuterHTMLText;	
	} else {
		headerRow.cells[i].outerHTML = "<th> Wut </th>";
	}
}
return headerRow;
}


function removeAllRowsCols(tableRef) {
while(tableRef.rows.length > 0) {
	tableRef.deleteRow(0);
}
}

function generateSOPFormDivNode(variableList) {
	let nodeSOP = document.createElement("div");
	
	let titleNode = document.createElement("p");
	titleNode.innerHTML = "SOP Prime Implicants: ";

	let canonicalForm = document.createElement("p");
	let innerText = "= ";
	var addedVariables = new Array();
	
	if (variableList[0].length == 0) {
		innerText = innerText.concat(0);	
	} else {
		for (var k = 0; k < variableList.length; k++) {
			for (var i = 0; i < variableList[k].length; i++) {
				if (isOnlyDontCares(variableList[k])) {
					continue;
				}
				var text = "";
					if (variableList[k][i].isInLargestSubGroup) {
						for (var j = 0; j < variableList[k][i].variables.length; j++) {
							if (!addedVariables.includes(variableList[k][i].variables[j])) {
								text = text.concat(variableList[k][i].variables[j]);
								addedVariables.push(variableList[k][i].variables[j]);
								innerText = innerText.concat(text + " + ");
							}
						}
					}
			}
		}
		innerText = innerText.substring(0,innerText.length-2);
	}
	if (innerText == "") {
		innerText = "= 0";
	} else if (innerText.includes(1)) {
		innerText = "= 1";
	}
	canonicalForm.innerText = innerText;
	
	nodeSOP.appendChild(titleNode);
	nodeSOP.appendChild(canonicalForm);


	return nodeSOP;
}
function generatPOSFormDivNode() {
let nodePOS= document.createElement("div");
nodePOS.innerHTML = "POS";


return nodePOS;
}

function generateKMapTableNode(numBits, outputIndex) {
let kMapTable = document.createElement("TABLE");
kMapTable.classList.add("table-border");
kMapTable.classList.add("standard-border");
kMapTable.setAttribute("id", "y" + outputIndex);

let subscriptText = "<span style=\"border: none; font-size: 50%; vertical-align: text-bottom\">" +  outputIndex + "</span>";
let tableTitle = "<th style=\" letter-spacing: -5px\">y" + subscriptText  + "</th>";

switch (numBits) {
	case 2:
		// 4 * 4 table //
		for (var k = 0; k < 4; k++) {
			let newRow = kMapTable.insertRow(0);
			var numCells;

			if (k == 3) {
				var numCells = 2;
			} else if (k == 2) {
				var numCells = 4;
			} else {
				numCells = 3;
			}
				for (var j = 0; j < numCells; j++) {
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
	
	
		// Assigning Decimal Values to each cell 
		kMapTable.rows[2].cells[1].setAttribute("data-decimalValue", binaryToDecimal("00"));
		kMapTable.rows[2].cells[2].setAttribute("data-decimalValue", binaryToDecimal("10"));

		kMapTable.rows[3].cells[1].setAttribute("data-decimalValue", binaryToDecimal("01"));
		kMapTable.rows[3].cells[2].setAttribute("data-decimalValue", binaryToDecimal("11"));
		
		// Appending Text Nodes to Each Cell::
		for (var i = 2; i <= 3; i++) {
			for (var k = 1; k <= 2; k++) {
				kMapTable.rows[i].cells[k].appendChild(document.createTextNode("0"));
			}
		}

		break;

	case 3:
		for (var k = 0; k < 4; k++) {
			let newRow = kMapTable.insertRow(0);
			var numCells;

			if (k == 3) {
				var numCells = 2;
			} else if (k == 2) {
				var numCells = 6;
			} else {
				numCells = 5;
			}
				for (var j = 0; j < numCells; j++) {
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
	
		// Assigning Decimal Values to each cell 
		kMapTable.rows[2].cells[1].setAttribute("data-decimalValue", binaryToDecimal("000"));
		kMapTable.rows[2].cells[2].setAttribute("data-decimalValue", binaryToDecimal("010"));
		kMapTable.rows[2].cells[3].setAttribute("data-decimalValue", binaryToDecimal("110"));
		kMapTable.rows[2].cells[4].setAttribute("data-decimalValue", binaryToDecimal("100"));
		
		kMapTable.rows[3].cells[1].setAttribute("data-decimalValue", binaryToDecimal("001"));
		kMapTable.rows[3].cells[2].setAttribute("data-decimalValue", binaryToDecimal("011"));
		kMapTable.rows[3].cells[3].setAttribute("data-decimalValue", binaryToDecimal("111"));
		kMapTable.rows[3].cells[4].setAttribute("data-decimalValue", binaryToDecimal("101"));

		// Appending Text Nodes to Each Cell::
		for (var i = 2; i <= 3; i++) {
			for (var k = 1; k <=4; k++) {
				kMapTable.rows[i].cells[k].appendChild(document.createTextNode("0"));
			}
		}

		break;
	case 4:
		for (var k = 0; k < 6; k++) {
			let newRow = kMapTable.insertRow(0);
			var numCells;

			if (k == 5) {
				var numCells = 2;
			} else if (k == 4) {
				var numCells = 6;
			} else {
				numCells = 5;
			}
				for (var j = 0; j < numCells; j++) {
					newRow.insertCell(0);
			}
		}
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
		kMapTable.rows[4].cells[0].innerHTML = "11";
		kMapTable.rows[5].cells[0].innerHTML = "10";
	
		// Assigning Decimal Values to each cell 
		kMapTable.rows[2].cells[1].setAttribute("data-decimalValue", binaryToDecimal("0000"));
		kMapTable.rows[2].cells[2].setAttribute("data-decimalValue", binaryToDecimal("0100"));
		kMapTable.rows[2].cells[3].setAttribute("data-decimalValue", binaryToDecimal("1100"));
		kMapTable.rows[2].cells[4].setAttribute("data-decimalValue", binaryToDecimal("1000"));
		
		kMapTable.rows[3].cells[1].setAttribute("data-decimalValue", binaryToDecimal("0001"));
		kMapTable.rows[3].cells[2].setAttribute("data-decimalValue", binaryToDecimal("0101"));
		kMapTable.rows[3].cells[3].setAttribute("data-decimalValue", binaryToDecimal("1101"));
		kMapTable.rows[3].cells[4].setAttribute("data-decimalValue", binaryToDecimal("1001"));
		
		kMapTable.rows[4].cells[1].setAttribute("data-decimalValue", binaryToDecimal("0011"));
		kMapTable.rows[4].cells[2].setAttribute("data-decimalValue", binaryToDecimal("0111"));
		kMapTable.rows[4].cells[3].setAttribute("data-decimalValue", binaryToDecimal("1111"));
		kMapTable.rows[4].cells[4].setAttribute("data-decimalValue", binaryToDecimal("1011"));
		
		kMapTable.rows[5].cells[1].setAttribute("data-decimalValue", binaryToDecimal("0010"));
		kMapTable.rows[5].cells[2].setAttribute("data-decimalValue", binaryToDecimal("0110"));
		kMapTable.rows[5].cells[3].setAttribute("data-decimalValue", binaryToDecimal("1110"));
		kMapTable.rows[5].cells[4].setAttribute("data-decimalValue", binaryToDecimal("1010"));

		// Appending Text Nodes to Each Cell::
		for (var i = 2; i <= 5; i++) {
			for (var k = 1; k <=4; k++) {
				kMapTable.rows[i].cells[k].appendChild(document.createTextNode("0"));
			}
		}

		break;
}
return kMapTable;
}


function getCorrespondingLetter(index) {
switch (index) {
	case 0:
		return "A";
	case 1:
		return "B";
	case 2: 
		return "C";
	case 3:
		return "D";
	case 4:
		return "E";
	case 5:
		return "F";
	default:
		return "NA";
}
}


// ************************** //
// *** SOP/POS Algorithms *** //
// ************************** //

function grabVariablesFromDecimalValue(decimalValue, numBits) {
// TODO FIND BETTER WAY TO ORGANIZE THIS STUFF
switch (numBits) {
	case 2:
		switch (decimalValue) {
			case 0:
				return new Array("A'", "B'");
				break;
			case 1: 
				return new Array("A'", "B");
				break;
			case 2:
				return new Array("A", "B'");
				break;
			case 3:
				return new Array("A", "B");
				break;
		}
	case 3:
		switch (decimalValue) {
			case 0:
				return new Array("A'", "B'", "C'");
			case 1:
				return new Array("A'", "B'", "C");
			case 2: 
				return new Array("A'", "B", "C'");
			case 3:
				return new Array("A'", "B", "C");
			case 4:
				return new Array("A", "B'", "C'");
			case 5:
				return new Array("A", "B'", "C");
			case 6:
				return new Array("A", "B", "C'");
			case 7:
				return new Array("A", "B", "C");
		}
	case 4:
		switch (decimalValue) {
			case 0:
				return new Array("A'", "B'", "C'", "D'");
			case 1:
				return new Array("A'", "B'", "C'", "D");
			case 2: 
				return new Array("A'", "B'", "C", "D'");
			case 3:
				return new Array("A'", "B'", "C", "D");
			case 4:
				return new Array("A'", "B", "C'", "D'");
			case 5:
				return new Array("A'", "B", "C'", "D");
			case 6:
				return new Array("A'", "B", "C", "D'");
			case 7:
				return new Array("A'", "B", "C", "D");
			case 8:
				return new Array("A", "B'", "C'", "D'");
			case 9:
				return new Array("A", "B'", "C", "D");
			case 10:
				return new Array("A", "B'", "C", "D'");
			case 11: 
				return new Array("A", "B'", "C", "D");
			case 12:
				return new Array("A", "B", "C'", "D'");
			case 13:
				return new Array("A", "B", "C'", "D");
			case 14:
				return new Array("A", "B", "C", "D'");
			case 15:
				return new Array("A", "B", "C", "D");
		}
	}
}

function getImplicantsFromKMap(kMapTable, numBits, desiredValue) {

	var size = 1;
	var implicantList = new Array();
	for (var i = kMapTable.rows.length-1; i >= 0; i--) {
		for (var k = 0; k < kMapTable.rows[i].cells.length; k++) {
			if (kMapTable.rows[i].cells[k].dataset.decimalvalue != null) {
				if ((kMapTable.rows[i].cells[k].innerText == desiredValue) || (kMapTable.rows[i].cells[k].innerText == 'x')){
					console.log("i: " + i + " k: " + k + ", value: " + kMapTable.rows[i].cells[k].dataset.decimalvalue);
					let variables = grabVariablesFromDecimalValue(parseInt(kMapTable.rows[i].cells[k].dataset.decimalvalue), numBits); 
					let newImplicant = new PrimeImplicant(size,variables);
					if (kMapTable.rows[i].cells[k].innerText == 'x') {
						newImplicant.isInLargestSubGroup = false;
						newImplicant.isDontCare = true;
					}
					implicantList.push(newImplicant);
				}
			}
		}
}

return implicantList;

}

function returnPrimeAdjacencyList(implicantList, numBits) {
	let adjancencyGroupSizes = new Array(1, 2, 4, 8, 16);

	var primeAdjacencyListBySize = new Array(adjancencyGroupSizes.length);
	primeAdjacencyListBySize[0] = implicantList; // gets all Xs too
	primeAdjacencyListBySize[1] = new Array();
	primeAdjacencyListBySize[2] = new Array();
	primeAdjacencyListBySize[3] = new Array();
	primeAdjacencyListBySize[4] = new Array();

	for (var r = 0; r < primeAdjacencyListBySize.length; r++) {
		debugger;
		for (var i = 0; i < primeAdjacencyListBySize[r].length; i++) {

			let primeImplicant1 = primeAdjacencyListBySize[r][i];	
			for (var j = i+1; j < primeAdjacencyListBySize[r].length; j++) {
				let primeImplicant2 = primeAdjacencyListBySize[r][j];
				if ((primeImplicant1.isDontCare) &&  (primeImplicant2.isDontCare)){
					continue;
				}
				if (primeImplicant1.isAdjacentTo(primeImplicant2)) {
					let newImplicant = combinePrimeImplicants(primeImplicant1, primeImplicant2); 
					if (!primeAdjacencyListBySize[r+1].includes(newImplicant)) {
						primeAdjacencyListBySize[r+1].push(newImplicant);
					}
					primeAdjacencyListBySize[r][i].isInLargestSubGroup = false;
					primeAdjacencyListBySize[r][j].isInLargestSubGroup = false;
				}
			}
		}
	}

	return primeAdjacencyListBySize;
}
			

function combinePrimeImplicants(implicant1, implicant2) {
	var variables = new Array();
	// Removes the one variable that differs:
	for (var i = 0; i < implicant1.variables.length; i++) {
		if (implicant2.variables.includes(implicant1.variables[i])) {
			variables.push(implicant1.variables[i]);
		}
	}
	if (variables.length == 0) {
		variables.push("1");
	}
	return new PrimeImplicant(implicant1.size*2, variables);
}

function isOnlyDontCares(listPrimeImplicants) {
	for (var i = 0; i < listPrimeImplicants.length; i++) {
		if (!listPrimeImplicants[i].isDontCare) {
			return false;	
		}
	}
	return true;
}


function PrimeImplicant(size, variables) {
	this.size = size;
	//this.bottomLeftIndex = bottomLeftIndex; // type (x,y)*/
	this.variables = variables;
	this.isDontCare = false;
	this.isInLargestSubGroup = true;
	//this.bottomRightIndex = new Point(this.bottomLeftIndex.x + (this.width-1), this.bottomLeftIndex.y);
	this.hasSameDimensionsAs = function(primeImplicant2) {
		if ((this.size == primeImplicant2.size) ) {
				// equal width is implied
				return true;
			} else {
				return false;
			}
	} 

	this.isAdjacentTo = function(primeImplicant2) {
		// is Adjacent iff there exists a single complement between the two, and all other variables are the same
		let variableList1 = this.variables;
		let variableList2 = primeImplicant2.variables;
		var numDiff = 0;
		
		for (var i = 0; i < variableList1.length; i++) {
			if (!variableList2.includes(variableList1[i])) {
				var complementFlag = false;
				numDiff++;
				for (var j = 0; j < variableList2.length; j++) {
					if (areComplements(variableList1[i], variableList2[j])){
						complementFlag = true;
					}
				}
				if(!complementFlag) {
					return false;
				}
			}
		}
		if (numDiff == 1) {
			return true;
		} else {
			return false;
		}
	}
}


function areComplements(char1, char2) {
	if ((char1[0] == char2[0]) && (char1.length != char2.length)) {
		return true;
	} else {
		return false;
	}
}
