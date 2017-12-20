let myLibrary = [];

function Book(name, author, pages, read){
	this.name = name,
	this.author = author,
	this.pages = pages,
	this.read = read,

	this.info = function(){
		let read = "finished";
		if(!this.read){
			read ="not read yet";
		}
		console.log(this.name+" by "+this.author+", "+this.pages+", "+read);
	},

	this.status = function(){
		let status;
		if(this.read){
			status = "finished"
		}else{
			status =  "not read yet";
		}
		return status;
	}
}

let numBooks = 0;

function addBookToLibary(book){
	myLibrary.push(book);
	numBooks+=1;
}

function render(){
	let newRow;
	let book;
	let name,author,pages,status;

	for(let i =numBooks-1;i<myLibrary.length;i++){
		book = myLibrary[i];

// function createElement(element,id,property)
		newRow = document.createElement("tr");
		newRow.id = "book"+i;

		name = document.createElement("td");
		name.id = 'name';
		name.innerHTML = book.name;

		edit = document.createElement("td");
		edit.id = 'edit'
		edit.innerHTML = 'edit';

		author = document.createElement("td");
		author.id = 'author';
		author.innerHTML = book.author;

		pages = document.createElement("td");
		pages.id = 'pages';
		pages.innerHTML = book.pages;

		status = document.createElement("td");
		status.id = 'status';
		let selectList = document.createElement("SELECT");
		let array = ["not read yet","finished"];
		selectList.id = "mySelect"+i;
		//create and append options
		for(let i=0;i<array.length;i++){
			let option = document.createElement("option");
			option.setAttribute("value",array[i]);
			option.text = array[i];
			selectList.appendChild(option);
		}
		selectList.value = book.status();
		status.append(selectList);

		

		remove = document.createElement("td");
		let a = document.createElement("a");
		a.id = newRow.id;
		a.setAttribute("onclick", "removeBook(this.id)");
		a.innerHTML = 'delete';
		a.href="#";
		remove.append(a);

		newRow.append(name,edit,author,pages,status,remove);


		
		document.getElementById("bookTable").append(newRow);

		document.getElementsByTagName('select')[0].onchange = function(){
			editStatus(this);
		}

	}
}

function createElement(element,id,property){
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
	let x = document.getElementById("showFormButton");
	if(x.textContent == "Add Book"){
		document.getElementById("bookForm").style.display = "block";
		x.textContent = "Cancel";
	}else{
		document.getElementById("bookForm").style.display = "none";
		x.textContent = "Add Book";
	}
}

function addBook(){
    let inputs = document.querySelectorAll("input");
    console.log("addbook");

    if(checkFormErrors(inputs)){
    	console.log("errors");
    	return;
    }
    console.log("huh");
	addBookToLibary(new Book(inputs[0].value, inputs[1].value,inputs[2].value));
	render();
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
}

// when user changes 
function editStatus(obj){
	//okay we want to show a form
	//create form in the box you want form to be in
	//get index of option selected
	let index = obj.selectedIndex;
	//get value of option selected 
	let inputText = obj.children[index].innerHTML.trim();
	//update book info
	let book = myLibrary[getIndex(obj.id)];
	
	if(inputText == "finished"){
		book.read = true;
	}else{
		book.read = false;
	}
}