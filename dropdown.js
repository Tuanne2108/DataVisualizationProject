//how long transition last
function changeLevel(){
let transitionTime = 2000
//get dropdown element by its id
var dropdown = document.getElementsByID("educational_level");
//Get selected option
var selectedOption = dropdown.options[dropdown.selectedIndex].value;

// Display the selected option
console.log("selected option:"+ selectedOption);
}
