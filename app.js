let specialistIndexes = [];
let workingPlaces = [];
let title;
let schedule = [];
let rows = [];
const MONTHS = ["OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"];
const ALLOWED_EXTENSIONS = ["XLSX", "XLS"];


const file = document.getElementById("input");

file.addEventListener("change", () => {
	const fileExtension = file.value.split('.').pop();
	if(ALLOWED_EXTENSIONS.indexOf(fileExtension.toUpperCase()) < 0) {
		alert("Allowed Extensions:" + ALLOWED_EXTENSIONS);
		file.value = null;
		return;
	} else {
		readXlsxFile(file.files[0]).then((pageRows) => {
			rows = pageRows;
			document.getElementById('btn').disabled = false;
		});
	}
});


const button = document.getElementById("btn");
button.addEventListener("click", () => {
	findSchedule(rows).then(() => {
		if(schedule.length > 0) {
			writeTableWith(schedule);
			document.getElementById('btn').disabled = true;
		} else {
			alert("Allowed Extensions:" + ALLOWED_EXTENSIONS);
		}
	});

});

const getMonthFrom = (title) => {
	if(title == null) return "";
	title = title.toUpperCase().trim();

	for(let i = 0; i < MONTHS.length; i++) {
		const month = MONTHS[i];
		if(title.match(month)) {
			return month;
		}
	}
}


const findSchedule = async (rows) => {
	const docName = document.getElementById("dr-name").value;
	title = rows[0][0];

	const month = getMonthFrom(title);
	workingPlaces = rows[1];
	specialistIndexes = findSpecialistIndexes();

	for(let rowNum = 0; rowNum < rows.length; rowNum++) {
		const row = rows[rowNum];

		for(let colNum = 0; colNum < row.length; colNum++) {
			const cell = row[colNum];

			if(cell === docName) {
				schedule.push({
					"date": getDate(row[0], month, row[1]),
					"place": getPlace(workingPlaces[colNum]),
					"time": getTime(workingPlaces[colNum]),
					"specialists": findSpecialistsFor(row)
				});
			}
		}
	}
}

const getDate = (dayNo, month, day) => {
	return dayNo + " " + month + " " + day;
}

const getPlace = (placeAndTime) => {
	var pattern = /[a-zA-Z]+/g;
	return placeAndTime.match(pattern).join(" ").trim();
}

const getTime = (placeAndTime) => {
	var pattern = /[a-zA-Z]+/g;
	return placeAndTime.replace(pattern, "").trim();
}


const findSpecialistIndexes = () => {
	const indexes = [];
	const regex = new RegExp("ACİL TIP UZMANI+");
	for(let i = 0; i < workingPlaces.length; i++) {
		const place = workingPlaces[i];
		if(regex.test(place)) {
			indexes.push(i);
		}
	}
	return indexes;
}


const findSpecialistsFor = (row) => {
	const specialists = [];
	for(let index of specialistIndexes) {
		const specialist = row[index];
		if(specialist != null) {
			specialists.push(specialist);
		}
	}
	return specialists;
}

const writeTableWith = (schedule) => {
	var wrapper = document.getElementById("wrapper");

	var table = document.createElement("table");
	table.setAttribute("class", "table table-striped")

	var thead = document.createElement("thead");

	var tr = document.createElement("tr");
	thead.appendChild(tr);

	var tdDateTitle = document.createElement("th");
	tdDateTitle.setAttribute("scope", "col");
	tdDateTitle.innerHTML = "TARİH";
	thead.appendChild(tdDateTitle);

	var tdWorkingPlaceTitle = document.createElement("th");
	tdWorkingPlaceTitle.setAttribute("scope", "col");
	tdWorkingPlaceTitle.innerHTML = "YER";
	thead.appendChild(tdWorkingPlaceTitle);

	var tdTimeTitle = document.createElement("th");
	tdTimeTitle.setAttribute("scope", "col");
	tdTimeTitle.innerHTML = "ZAMAN";
	thead.appendChild(tdTimeTitle);

	var tdSpecialistsTitle = document.createElement("th");
	tdSpecialistsTitle.setAttribute("scope", "col");
	tdSpecialistsTitle.innerHTML = "ACİL TIP UZMAN(LAR)I";
	thead.appendChild(tdSpecialistsTitle);
	table.appendChild(thead);


	var tbody = document.createElement("tbody");

	for(let i = 0; i < schedule.length; i++) {
		const scheduleElement = schedule[i];
		var tr = document.createElement("tr");
		tbody.appendChild(tr);

		var tdDay = document.createElement("td");
		tdDay.innerHTML = scheduleElement.date;
		tr.appendChild(tdDay);

		var tdDay = document.createElement("td");
		tdDay.innerHTML = scheduleElement.place;
		tr.appendChild(tdDay);

		var tdWorkingPlace = document.createElement("td");
		tdWorkingPlace.innerHTML = scheduleElement.time;
		tr.appendChild(tdWorkingPlace);

		var tdSpecialists = document.createElement("td");
		tdSpecialists.innerHTML = scheduleElement.specialists;
		tr.appendChild(tdSpecialists);
	}

	table.appendChild(tbody);
	wrapper.appendChild(table);
	document.body.appendChild(wrapper);

	var footer = document.getElementById("footer");
	document.body.appendChild(footer);
}
