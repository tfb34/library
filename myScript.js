let myLibrary = [];
let numBooks = 0;
//if item is found, then extract info
if(localStorage.getItem('myLibrary')){
	// may throw exception, so come back to this
	console.log("localStorage found");
	myLibrary = JSON.parse(localStorage.getItem('myLibrary')); 
	numBooks = JSON.parse(localStorage.getItem('numBooks'));
}else{
	console.log("no localStorage apparently");
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	localStorage.setItem('numBooks',JSON.stringify(numBooks));
}

setTimeout(function(){
    render(0);
}, 200);

function Book(name, author, pages,score){
	this.name = name,
	this.author = author,
	this.pages = pages,
	this.read = false,// undefined
	this.score = score,
	this.deleted = false
}

function bookStatus(read){
	let status;
	if(read){
		status = "finished";
	}else{
		status = "not read yet";
	}return status;
}


function addBookToLibary(book){
	console.log("addBookToLibary");
	myLibrary.push(book);
	numBooks+=1;
	// update localStorage items if they exist
	if(localStorage.getItem('myLibrary') && localStorage.getItem('numBooks')){
		console.log("items do exist. ready for update..");
		localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
		localStorage.setItem('numBooks',JSON.stringify(numBooks));
	}

}

function render(startingIndex){
	console.log("render"+startingIndex);
	let newRow;
	let book;
	let name,author,pages,status, score;

	for(let i =startingIndex;i<myLibrary.length;i++){// numBooks-1, startingIndex
		book = myLibrary[i];
		console.log(book);
		if(book.deleted == false){
			// function createElement(element,id,property)
			newRow = document.createElement("tr");
			newRow.id = "book"+i;

			name = document.createElement("td");
			name.id = 'name'+i;
			name.innerHTML = book.name;

			edit = document.createElement("td");
			let x = document.createElement("a");
			x.id =newRow.id;
			x.href="#";
			x.innerHTML = 'edit';
			x.setAttribute("onclick","matchBook(this.id)");
			edit.append(x);

			author = document.createElement("td");
			author.id = 'author'+i;
			author.innerHTML = book.author;

			pages = document.createElement("td");
			pages.id = 'pages'+i;
			pages.innerHTML = book.pages;

			score = document.createElement("td");
			score.id = "score"+i;
			score.innerHTML = book.score;

			status = document.createElement("td");
			status.id = 'status';
			let selectList = document.createElement("SELECT");
			let array = ["not read yet","finished"];
			selectList.id = "mySelect"+i;


			// Status options
			for(let i=0;i<array.length;i++){
				let option = document.createElement("option");
				option.setAttribute("value",array[i]);
				option.text = array[i];
				selectList.appendChild(option);
			}
			selectList.value = bookStatus(book.read); // book.status();
			status.append(selectList);

			

			remove = document.createElement("td");
			let a = document.createElement("a");
			a.id = newRow.id;
			a.setAttribute("onclick", "removeBook(this.id)");
			a.innerHTML = 'delete';
			a.href="#";
			remove.append(a);

			newRow.append(name,edit,author,score,pages,status,remove);

			document.getElementById("bookTable").append(newRow);
			document.getElementsByTagName('select')[0].onchange = function(){
				editStatus(this);
			}
		}
	}
}


function createElement(element,id,property){
	console.log("createElement");
	let x = document.createElement(element);
	x.id = id;
	if(property != "status"){
		x.innerHTML = book[property];
	}else{
		x.innerHTML = book[property]();
	}
	return x;
}


//add book to cancel, toggle
function showForm(){
	console.log("showForm");
	let x = document.getElementById("showFormButton");
	let form = document.getElementById("bookForm");
	if(x.textContent == "Add Book"){
		form.style.display = "block";
		form.reset();
		x.textContent = "Cancel";

	}else{
		document.getElementById("bookForm").style.display = "none";
		x.textContent = "Add Book";
	}
}

function addBook(){
	console.log("addBook");
    let inputs = document.querySelectorAll("input");

    if(checkFormErrors(inputs)){
    	return;
    }

    let score = document.getElementById("selectScore").value;

    if(score == "selectScore"){
    	score = '-';
    }
	addBookToLibary(new Book(inputs[0].value, inputs[1].value,inputs[2].value,score));
	
	//display new book item
	render(numBooks-1);
	document.getElementById('bookForm').reset();
	showForm();
}
// name author pages 
function checkFormErrors(inputs){
	console.log("checkFormErrors");
	let errors = false;
	if(inputs[0].value =="" || inputs[1].value==""){
		errors = true;
		alert("Please enter the title and author of book.");
	}
	return errors;
}

// Given: a string with numbers. (e.g. "book10")
// Return: number found in string. (returns 10);
function getIndex(id){
	console.log("getIndex")
	let index = parseInt(id.match(/(\d[\d\.]*)/g));
	return index;
}

function removeBook(id){
	console.log('deleting '+id);

	//let index = parseInt(id.match(/(\d[\d\.]*)/g));
	//myLibrary.splice(index, 1);
	//must put a deleted boolean to record that it has been removed
	console.log(myLibrary);
	//numBooks-=1;
	//remove from table
	document.getElementById(id).remove();
	//update localStorage
	let book = myLibrary[getIndex(id)];
	book.deleted = true;

	if(localStorage.getItem('myLibrary')){
		localStorage.setItem('myLibrary',JSON.stringify(myLibrary));
	}
}

function editStatus(obj){
	console.log("editStatus");
	let index = obj.selectedIndex;
	
	let inputText = obj.children[index].innerHTML.trim();
	// update book info
	let book = myLibrary[getIndex(obj.id)];
	// update book info
	if(inputText == "finished"){
		book.read = true;
	}else{
		book.read = false;
	}
	// update localStorage
	if(localStorage.getItem('myLibrary')){
		localStorage.setItem('myLibrary',JSON.stringify(myLibrary));
	}
}


// link edit form to book
function matchBook(id){
	//close other forms if opened
	console.log("matchBook called")
	document.getElementById("bookForm").style.display = "none";
	document.getElementById("showFormButton").textContent = "Add Book";

	let index = getIndex(id);
	let book = myLibrary[index];
	document.getElementById("template").style.display="block";
	document.getElementById("displayTitle").innerHTML = book.name;
	document.getElementById("displayAuthor").innerHTML = book.author;
	document.getElementById("editPages").value = book.pages;

	console.log(book.score);
	if(book.score == '-'){
		document.getElementById("default").selected = true;
	}else{
		document.getElementById(book.score).selected = true;
	}
	let form =document.getElementsByClassName("formBook")[0];
	form.id= "bookNum"+index;
	//predefine value for pages and score to current book. innerHtml perhaps. change 'selected' 
	// add a cancel button to close form. 

}



function editBook(id){
	console.log("editBook called");
	let index = getIndex(id);
	
	let inputs = document.querySelectorAll("input");

	let pages = inputs[4].value;
	let score = document.getElementById("editSelectScore").value;

	// update record
	let book = myLibrary[index];
	book.pages = pages;
	book.score = score;
	// update localStorage
	if(localStorage.getItem('myLibrary')){
		localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	}
	// display updated info
	document.getElementById("pages"+index).innerHTML = pages;
	document.getElementById("score"+index).innerHTML = score;
	// hide form
	closeEditForm();
}


function closeEditForm(){
	document.getElementById("template").style.display = "none";
}