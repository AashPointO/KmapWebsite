

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

function generateSOPDivNodeFor(variableList) {
	let nodeSOP = document.createElement("div");
	
	let titleNode = document.createElement("p");
	titleNode.innerHTML = "SOP Prime Implicants: ";

	let canonicalForm = document.createElement("p");
	let innerText = "F = ";
	var addedImplicants = new Array();
	
	if ((variableList.length() == 0) || (variableList.length() == variableList.numDontCares())) { // No possible set of inputs
		innerText = innerText.concat(0);	
	} else {
		for (var k = 0; k < variableList.length(); k++) { // For each Implicant
			let currImplicant = variableList.at(k);
			if ((!currImplicant.isDontCare) && (currImplicant.isInLargestGroup)) { 
				var implicantText = currImplicant.generateMinterm();
				if (!addedImplicants.includes(implicantText)) {
					innerText = innerText.concat(implicantText);
					innerText = innerText.concat(" + ");
					addedImplicants.push(implicantText);
				}
			}
		}
		innerText = innerText.substring(0,innerText.length-2); // removes last addition sign
	}

	canonicalForm.innerText = innerText;
	
	nodeSOP.appendChild(titleNode);
	nodeSOP.appendChild(canonicalForm);

	return nodeSOP;
}

function generatePOSDivNodeFor(variableList) {
	let nodePOS = document.createElement("div");
	
	let titleNode = document.createElement("p");
	titleNode.innerHTML = "POS Prime Implicants: ";

	let canonicalForm = document.createElement("p");
	let innerText = "F = ";
	var addedImplicants = new Array();
	
	if (variableList.length() == 0) { // No possible set of inputs
		innerText = innerText.concat(1);	
	} else {
		for (var k = 0; k < variableList.length(); k++) { // For each Implicant
			let currImplicant = variableList.at(k);
			if ((!currImplicant.isDontCare) && (currImplicant.isInLargestGroup)) { 
				var implicantText = currImplicant.generateMaxterm();
				if (!addedImplicants.includes(implicantText)) {
					if (implicantText != "0") {
						innerText = innerText.concat(" ( ");
						innerText = innerText.concat(implicantText);
						innerText = innerText.concat(" ) ");
					} else {
						innerText = innerText.concat(implicantText);
					}
					addedImplicants.push(implicantText);
				}
			}
		}
	}
	if (innerText == "F = ") {
		innerText = innerText.concat("1");
	}
	canonicalForm.innerText = innerText;
	
	nodePOS.appendChild(titleNode);
	nodePOS.appendChild(canonicalForm);

	return nodePOS;
}

function getSOP_PrimeImplicantsAt(colIndex, tableRef) {
	let primeImplicantSet = new OutputColSet(colIndex, "1", tableRef);
	let numBits = parseInt(tableRef.rows[0].cells[1].dataset.bitindex) + 1;
	let totPossibleNumGroupSizes = numBits + 1;

	primeImplicantSet.grabAllOutputNodesFromTable(tableRef);
	for (var i = 0; i < primeImplicantSet.length(); i++) {
		for (var j = i+1; j < primeImplicantSet.length(); j++) {
			let implicant1 = primeImplicantSet.at(i);
			let implicant2 = primeImplicantSet.at(j);
			if (implicant1.isAdjacentTo(implicant2)) {
				primeImplicantSet.push(implicant1.generateCombinationWith(implicant2));
				primeImplicantSet.outputSet[i].isInLargestGroup = false;
				primeImplicantSet.outputSet[j].isInLargestGroup = false;
			}
		}
	}
	return primeImplicantSet;
}


function getPOS_PrimeImplicantsAt(colIndex, tableRef) {
	let primeImplicantSet = new OutputColSet(colIndex, "0", tableRef);
	let numBits = parseInt(tableRef.rows[0].cells[1].dataset.bitindex) + 1;
	let totPossibleNumGroupSizes = numBits + 1;

	primeImplicantSet.grabAllOutputNodesFromTable(tableRef);
	for (var i = 0; i < primeImplicantSet.length(); i++) {
		for (var j = i+1; j < primeImplicantSet.length(); j++) {
			let implicant1 = primeImplicantSet.at(i);
			let implicant2 = primeImplicantSet.at(j);
			if (implicant1.isAdjacentTo(implicant2)) {
				primeImplicantSet.push(implicant1.generateCombinationWith(implicant2));
				primeImplicantSet.outputSet[i].isInLargestGroup = false;
				primeImplicantSet.outputSet[j].isInLargestGroup = false;
			}
		}
	}
	return primeImplicantSet;
}


function OutputColSet(outputIndex, valueDesired, tableRef) {
	// One for SOP, another for POS:: 
	this.outputIndex = parseInt(outputIndex);
	// outputSet is of type *OutputGroup
	this.outputSet = new Array();
	this.valueDesired = valueDesired;

	this.length = function() {
		return this.outputSet.length;
	}

	this.numDontCares = function() {
		var numDontCares = 0;
		for (var i = 0; i < this.outputSet.length; i++) {
			if (this.outputSet[i].isDontCare) {
				numDontCares++;
			}
		}
		return numDontCares;
	}
	
	this.at = function(index) {
		return this.outputSet[index];
	}

	this.grabAllOutputNodesFromTable = function(tableRef) {
		// OutputCol should be Reset ONLY if numBits is changed
		// All old values are lost
		this.outputSet = new Array();
		// Under assumpion col has dataset-outputindex
		for (var i = 1; i < tableRef.rows.length; i++) { // Ignoring Header Row
			var currRow = tableRef.rows[i];

			for (var j = 1; j < currRow.cells.length; j++) {

				if (j >= tableRef.rows[0].cells.length) { // ERROR HANDLING
					console.error("ERROR AT resetWithNumRowsAt()\nCould not Find ColIndex:" + j);
				}

				let numBits = parseInt(tableRef.rows[0].cells[1].dataset.bitindex) + 1;
				let binaryString = decimalToBinary(i-1, numBits); // i-1 b/c row value starts at 0, but index starts at 1
				var dontCareFlag;

				currCol = tableRef.rows[i].cells[j];

				if (parseInt(currCol.dataset.outputindex) == this.outputIndex) {
					switch (currCol.firstElementChild.value) {
						case valueDesired:
							var dontCareFlag = false;			
							var outputToPush = new OutputGroup(binaryString, dontCareFlag);
							this.outputSet.push(outputToPush);
							break;
						case "x":
							var dontCareFlag = true;			
							var outputToPush = new OutputGroup(binaryString, dontCareFlag);
							this.outputSet.push(outputToPush);
							break;
						default:
							break;
					}
				}
			}
		}
	}
	
	this.push = function(outputToPush) {
		this.outputSet.push(outputToPush);
	}

	this.getIndexForBinaryString = function(bStringCheckingFor) {
		for (var i = 0; i < this.outputSet.length; i++) {
			let currOutput = this.outputSet[i];
			if (currOutput.correspondingBinaryString == bStringCheckingFor) {
				return i;
			}
		}
		return -1;
	}
}
	
function OutputGroup(correspondingBinaryString, isDontCare) {
	// 1 for HIGH, 0 for LOW
	// f for FACTOREDOUT; that way numBits stays same
	// ex: 10f0 === A B' C(factored out) D' 
	this.correspondingBinaryString = correspondingBinaryString;
	// boolean
	// is True if entirety of outputGroup is derived from dontCares
	this.isDontCare = isDontCare; 

	this.isInLargestGroup = true;
	this.isEssential = true;

	this.getNumLiterals = function() { 
		var numLiterals = this.correspondingBinaryString.length;
		for (var i = 0; i < this.correspondingBinaryString.length; i++) {
			if (this.correspondingBinaryString[i] == 'f') {
				numLiterals--;
			}
		}
		return numLiterals;
	}


	this.isAdjacentTo = function(OutputGroup2) {
		let bString2 = OutputGroup2.correspondingBinaryString;
		if (this.correspondingBinaryString.length == bString2.length) {
			var numDiff = 0;
			var numComplements = 0;
			for (var i = 0; i < this.correspondingBinaryString.length; i++) {
				if (this.correspondingBinaryString[i] != bString2[i]) {
					numDiff++;
					if ((this.correspondingBinaryString[i] != 'f') && (bString2[i] != 'f') ){
						numComplements++;
					}
				}
			}
			if ((numDiff == 1) && (numComplements == 1)) {
				/* Represents fact that two sets of outputs forms
				 * an adjacency group iff for outputs with same dimesions,
				 * they have the same set of variables, but one.
				 * ex: ABC' (110)isAdjacentTo ABC (111)
				 *  ** Not Proven, but it seems right? **
				 */
				return true;
			} else {
				return false;
			}
		}
	}

	this.generateCombinationWith = function(outputGroup2) {
		var newDontCareFlag = false;
		if ((this.isDontCare) && (outputGroup2.isDontCare)) {
			newDontCareFlag = true;
		}
		let bString1 = this.correspondingBinaryString;
		let bString2 = outputGroup2.correspondingBinaryString;
		if (bString1.length != bString2.length) {
			console.warn("Trying to combine outputNodes of uneven sizes.");
		}
		var newString = "";
		for (var i = 0; i < bString1.length; i++) {
			let charString1 = bString1[i];
			let charString2 = bString2[i];

			if (charString1 == charString2) {
				newString = newString.concat(charString1);
			} else if ((charString1 != charString2) && (charString1 != "f") && (charString2 != "f")) {
				newString = newString.concat("f");
			} else {
				console.warn("Invalid use of generateCombinationWith()");
				newString = newString.concat("E"); // Error Bit
			}
		}

		if ((newString == bString1) || (newString == bString2) ) {
			console.warn("generatingCombination did not yield a unique result.");
		}

		return new OutputGroup(newString, newDontCareFlag);
	}

	this.generateMinterm = function() {

		if (this.getNumLiterals() == 0) {
			return "1";
		}

		var varString = "";
		for (var i = 0; i < this.correspondingBinaryString.length; i++) {
			if (this.correspondingBinaryString[i] == 'f') {
				continue;
			} else if (this.correspondingBinaryString[i] == "1") {
				varString = varString.concat(getCorrespondingLetter(i));
			} else {
				varString = varString.concat(getCorrespondingLetter(i));
				varString = varString.concat("\'");
			}
		}

		return varString;
	}
	
	this.generateMaxterm = function() {
debugger;
		if (this.getNumLiterals() == 0) {
			return "0";
		}

		var varString = "";

		for (var i = 0; i < this.correspondingBinaryString.length; i++) {
			if (this.correspondingBinaryString[i] == 'f') {
				continue;
			} else if (this.correspondingBinaryString[i] == "0") {
				varString = varString.concat(getCorrespondingLetter(i));
				varString = varString.concat("+");
			} else {
				varString = varString.concat(getCorrespondingLetter(i));
				varString = varString.concat("\'");
				varString = varString.concat("+");
			}
		}
		varString = varString.substring(0,varString.length-1); // Removes last addition sign
		return varString;
	}
}

function decimalToBinary(decimalNum, numBitsAtLeast) {
	// Returns a string
	var binaryString = decimalNum.toString(2);
	let sizeDiff = parseInt(numBitsAtLeast) - binaryString.length;
	for (var i = 0; i < sizeDiff; i++) {
		binaryString = "0" + binaryString;
	}
	return binaryString;
}
