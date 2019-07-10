function toTitleCase() {
	setTimeout(() => {
		const inputField = document.getElementById("inputField");
		const fullName = inputField.value;
		const titleCaseName = fullName
			.toLowerCase()
			.split(' ')
			.map(name => name.replace(/\b[a-z]/, firstLetter => firstLetter.toUpperCase()))
			.join(' ');
		inputField.value = titleCaseName;
	}, 0);
}