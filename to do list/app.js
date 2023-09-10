//--------------------------------- Switch ------------------------------------------------

var x = document.getElementById('ToDoList');
var y = document.getElementById('AddNewToDo');
var z = document.getElementById('btn');
function todosPage(){
   x.style.left = "27px";
   y.style.right = "-350px";
   z.style.left = "0px";
}
function AddTodoPage(){
  x.style.left = "-350px";
  y.style.right = "25px";
  z.style.left = "171px";
}

//---------------------------------Globallerin tanimlanmasi ------------------------------------------------

const addButton = document.querySelector('#todoForm');
const inputTitle = document.querySelector('.input-box');
const inputInfo = document.querySelector('#newToDoInfo');
const todoList = document.querySelector('.to-do-list');
const addBody = document.querySelector('.box-AddNewToDo');
const listBody = document.querySelector('.box-ToDoList');
//const deleteButton = document.querySelector('.deletebutton');
//const editButton = document.querySelector('.editbutton');
const searchInput = document.querySelector('#newToDoTitle');

let todos = [];
let isEditing = false;
let oldTodo;
let newTodo;

//--------------------------------- FONKSIYONLAR ------------------------------------------------

runEvents();

function runEvents(){
    addButton.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",pageloaded);
    //localStorage.clear();
    todoList.addEventListener("click", removeTodoUI);
   
    todoList.addEventListener("click", function (e) {
        if (e.target.className === "savebutton" && e.target.textContent === "Save") {
            isEditing = true;
        }
    });
    todoList.addEventListener("click", editTodoUI);
    todoList.addEventListener("click", editSaveTodoUI);
    searchInput.addEventListener("keyup", searchTodo);

}

//---------------------------------Local storageden ekrana verileri yazdirma ------------------------------------------------
 
function pageloaded(){
    checkTodosFromStorage();
    todos.forEach(function(todo){
        //console.log(todo.titletext);
        //console.log(todo.infotext);
        addTodoToUI(todo.titletext,todo.infotext);
    });
}


//---------------------------------TO DO EKLEME------------------------------------------------

function addTodo(e){
    const titletext = inputTitle.value;
    const infotext = inputInfo.value;

    //Arayuze ekleme
    addTodoToUI(titletext , infotext);
    showAlert();
    //LocalStorage ekleme
    addTodoToLocal(titletext , infotext);
    //console.log("submit calisti");
}

//-------------------------------Arayuze todo ekleme--------------------------------------
function addTodoToUI(titletext , infotext){
    /* 
        <li>
             <strong>Half-Life 2</strong>
             <p>Fight aliens, wear a head crab, learn about gravity</p>
       </li>
    */
            /*

            <li class="list-box">
                <div class="list-field">
                <strong>Half-Life 2</strong>
                <p>Fight aliens, wear a head crab, learn about gravity</p>
                <br>
                <div>
                        <button type="submit" class="editbutton">edit</button>
                        <button type="submit" class="deletebutton">delete</button>
                </div>
                </div>
                <br>
                
            </li>

            */
    const li = document.createElement("li");
    li.className = "list-box";

    const div = document.createElement("div");
    div.className = "list-field";

    const strong = document.createElement("strong");
    strong.textContent = titletext;

    const p = document.createElement("p");
    p.textContent = infotext;
    //p.type = "textarea";

    const br = document.createElement("br");

    const divButton = document.createElement("div");

    const buttonEdit = document.createElement("button");
    //buttonEdit.id = "todoEdit";
    buttonEdit.type = "submit";
    buttonEdit.className = "editbutton";
    buttonEdit.textContent = "Edit";

    const buttonDelete = document.createElement("button");
    //buttonDelete.id = "todoDelete";
    buttonDelete.type = "submit";
    buttonDelete.className = "deletebutton";
    buttonDelete.textContent = "Delete";

    div.appendChild(strong);
    div.appendChild(p);
    div.appendChild(br);
    divButton.appendChild(buttonEdit);
    divButton.appendChild(buttonDelete);
    div.appendChild(divButton);
    li.appendChild(div);
    //console.log(li);
    todoList.appendChild(li);

    inputTitle.value = "";
    inputInfo.value = "";
}

//-----------------------------LocalStorage todo ekleme--------------------------------------
function addTodoToLocal(titletext , infotext){

    checkTodosFromStorage();
    todos.push({titletext , infotext});
    localStorage.setItem("todos", JSON.stringify(todos));//yeni todos dizisini storge setliyoruz
    //localStorage.clear();

}

//-------------------LocalStorage Olusturulmus mu ve eger olusturulmus ise icinde bir deger var mi-------------------
function checkTodosFromStorage(){
    if(localStorage.getItem("todos")===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}

//-------------------Eger Todo basarili bir sekilde olusturulursa 2.5 saniye sonra kaybolan bir mesaj cikarir-------------------
function showAlert(){
 
    //           <div class="alert alert-success">
 //               <strong>Success!</strong> Indicates a successful or positive action.
 //          </div>

    const div = document.createElement("div");
    div.className = "alert alert-success";
    div.style.textAlign  = "center" ;
    //div.textContent = "To Do Created!";
    const strong = document.createElement("strong");
    strong.textContent = "Success!";
    div.appendChild(strong);
    addBody.appendChild(div);

    setTimeout(function(){
        div.remove();
    },2500);
}

//------------------------------------------- To Do Delete----------------------------------------

function removeTodoUI(e){
    //console.log("remove calisti");
    if(e.target.className == "deletebutton"){
        const todo = e.target.parentElement.parentElement.parentElement;
        
        //console.log(todo.textContent.replace("EditDelete", "").trim());
        removeTodoStorege(todo.textContent.replace("EditDelete", "").trim());//text contentin sonunda EditDelete yaziyordu her seferinde
                                                                            //bu kisimlar localstorege oldugu icin silme islemini yapamiyordu.
        todo.remove();
     }
}

function removeTodoStorege(removeTodo){
    checkTodosFromStorage();
    //console.log("buraya geldi");
    todos.forEach(function(todo,index){
        //console.log(todo.titletext+todo.infotext);
        if((todo.titletext+todo.infotext).trim() == removeTodo){
            todos.splice(index,1);
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));//yeni todos dizisini storge setliyoruz
}

//------------------------------------------- To Do Edit----------------------------------------

function editTodoUI(e){
    //console.log("edit calisti");
    if(e.target.className == "editbutton"){
        //console.log("edit if calisti");
        //console.log(e.target.parentElement.parentElement.querySelector('strong'));
        const div = e.target.parentElement.parentElement.parentElement.querySelector('div');
        const strong = e.target.parentElement.parentElement.querySelector('strong');
        const p = e.target.parentElement.parentElement.querySelector('p');
        const button = e.target;
        //console.log(div);
        //console.log(strong);
        //console.log(p);
        //console.log(button);
        oldTodo =  {titletext: strong.textContent, infotext: p.textContent};
        
        const inputEditTitle = document.createElement('input');
        inputEditTitle.type = "text";
        inputEditTitle.className = "editTitle-box";
        inputEditTitle.value = strong.textContent;
        //console.log(inputEditTitle.value);

        const inputEditInfo = document.createElement('textarea');
        inputEditInfo.type = "text";
        inputEditInfo.className = "editInfo-box";
        inputEditInfo.value = p.textContent;
        //console.log(inputEditInfo.value);

        div.insertBefore(inputEditTitle,strong);
        div.removeChild(strong);

        div.insertBefore(inputEditInfo,p);
        div.removeChild(p);

        //isEditing = true;
        button.textContent = "Save";
        button.className = "savebutton";

    }
}
//------------------------------------------- To Do Edit Save----------------------------------------

function editSaveTodoUI(e) {
    if (isEditing && e.target.className === "savebutton") {
        const div = e.target.parentElement.parentElement.parentElement.querySelector('div');
        const inputEditTitle = div.querySelector('.editTitle-box');
        const inputEditInfo = div.querySelector('.editInfo-box');
        const strong = document.createElement('strong');
        const p = document.createElement('p');

        strong.textContent = inputEditTitle.value;
        //strong.textContent = "Burayi goruyor";
        p.textContent = inputEditInfo.value;

        div.insertBefore(strong, inputEditTitle);
        div.insertBefore(p, inputEditInfo);

        div.removeChild(inputEditTitle);
        div.removeChild(inputEditInfo);

        newTodo =  {titletext: strong.textContent, infotext: p.textContent};
        e.target.textContent = "Edit";
        e.target.className = "editbutton";
        isEditing = false;

        storageTodoEditReplace(oldTodo, newTodo);
    }
}

//------------------------------------------- To Do Edit Save to Storage----------------------------------------

function storageTodoEditReplace(oldTodo, newTodo) {
    checkTodosFromStorage();
    
    const index = todos.findIndex(todo => todo.titletext === oldTodo.titletext && todo.infotext === oldTodo.infotext);
    
    if (index !== -1) {
        todos[index] = newTodo;
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

//------------------------------------------- To Do Search----------------------------------------

function searchTodo(e){

    const filterValue = e.target.value.toLocaleLowerCase().trim();
    const listValues = document.querySelectorAll('.list-box');
    //console.log(filterValue);

    listValues.forEach(function(todo){
        //console.log(todo.textContent);
        //text contentin sonunda EditDelete yaziyordu her seferinde bu kisimlar localstorege oldugu icin silme islemini yapamiyordu.
        if(todo.textContent.replace("EditDelete", "").toLocaleLowerCase().trim().includes(filterValue)){
            todo.setAttribute("style", "display : block");
        }else{
            todo.setAttribute("style", "display : none !important");
        }
    });
}

