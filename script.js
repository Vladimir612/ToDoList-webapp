//Grabbing the items
const list = document.querySelector('#list');
const item = document.querySelector('#item');
const clear = document.querySelector(".clear");

const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle';
const LINE_THROUGH = 'lineThrough';
//thanks to this I change icons not just their style
let LIST, id;

let data = localStorage.getItem('TASK');//Grabbing the data from local storage

if(data){//If there is any data
    LIST = JSON.parse(data);//Making JSON of data we took 
    id = LIST.length;
    loadList(LIST);//loading data in html
}else{
    LIST = [];//List is empty otherwise
    id = 0;
}

function loadList(array){
    array.forEach(item => {
        addTask(item.name, item.id, item.done, item.trash);//loading data in html
    });
}

clear.addEventListener('click', function(){
    localStorage.clear();
    location.reload();
});

//Setting the date
let date = document.querySelector('.date');
let day;
switch(new Date().getDay()){
    case 0:
        day = 'Monday';
        break;
    case 1:
        day = 'Tuesday';
        break;
    case 2:
        day = 'Wednesday';
        break;
    case 3:
        day = 'Thursday';
        break;
    case 4:
        day = 'Friday';
        break;
    case 5:
        day = 'Saturday';
        break;
    case 6:
        day = 'Sunday';
        break;
}
let current_date = new Date().getDate() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getFullYear() + ' ' + day ; 
date.innerHTML = current_date;

function addTask(selectedItem, id, done, trash){

    if(trash) {return;} //if trash is true item won't be shown

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : '';

    const text = `<li>
        <i class="far ${DONE} co" job="complete" id="${id}"></i></i>
        <p class="text ${LINE}">${selectedItem}</p>
        <i class="fas fa-trash de" job="delete" id="${id}"></i>
    </li>`;//this part making real work in putting in html

    list.insertAdjacentHTML('beforeend', text);//this means it will be after last item of list every time
}
document.addEventListener('keyup', function(e){
    if (e.keyCode == 13){//pressed Enter
        const task = item.value;
        if(task){//if input is empty function won't be executed
            addTask(task, id, false, false);//putting in html
            LIST.push({
                name : task,
                id : id,
                done : false,
                trash: false
            }); //putting in list
            localStorage.setItem('TASK', JSON.stringify(LIST));//putting in local storage
            id++;
        }
        item.value = '';
    }
});

function completeTask(element){
    //changing the style on click
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);
    //changing info is task done in list so next time when you refresh because list is pushed in local storage it will stay checked
    LIST[element.id].done = LIST[element.id].done ? false : true;
}
function removeTask(element){
    element.parentNode.parentNode.removeChild(element.parentNode);//removing from html
    //similar to 102
    LIST[element.id].trash = true;
}

list.addEventListener('click', function(event){
    const element = event.target;//setting element based on where you clicked
    const elementJob = element.attributes.job.value;//getting the job of an element

    if(elementJob == 'complete'){
        completeTask(element);
    }else if(elementJob == 'delete'){
        removeTask(element);
    }

    localStorage.setItem('TASK', JSON.stringify(LIST));//Making change in local storage also
});
//Scrolling
const contentScroll = document.querySelector('.content');
contentScroll.onscroll = function(){
    let progress = document.querySelector('#progressbar');
    
    let totalHeight = contentScroll.scrollHeight - contentScroll.offsetHeight;
    let progressHeight = (contentScroll.scrollTop / totalHeight) * 100;
    progress.style.height = `${progressHeight}%`;
}

