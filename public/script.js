const db = firebase.firestore();
let thingsRef;
let unsubscribe;
//Grabbing the items
const list = document.querySelector('#list');
const item = document.querySelector('#item');
const clear = document.querySelector(".clear");


thingsRef = db.collection('tasks');//Grabs the database

clear.addEventListener('click', function(){
    thingsRef.get().then(res =>{
        res.forEach(element => {
            element.ref.delete();
        });
    })
});

const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle';
const LINE_THROUGH = 'lineThrough';
//thanks to this I change icons not just their style

//Setting the date
let date = document.querySelector('.date');
let day;
switch(new Date().getDay()){
    case 1:
        day = 'Monday';
        break;
    case 2:
        day = 'Tuesday';
        break;
    case 3:
        day = 'Wednesday';
        break;
    case 4:
        day = 'Thursday';
        break;
    case 5:
        day = 'Friday';
        break;
    case 6:
        day = 'Saturday';
        break;
    case 0:
        day = 'Sunday';
        break;
}
let current_date = new Date().getDate() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getFullYear() + ' ' + day ; 
date.innerHTML = current_date;

document.addEventListener('keyup', function(e){
    if (e.keyCode == 13){//pressed Enter
        const task = item.value;
        const { serverTimestamp } = firebase.firestore.FieldValue;
        if(task){//if input is empty function won't be executed
            thingsRef.add({
                name : task,
                done : false,
                trash: false,
                timestamp: serverTimestamp(),
            }); //putting in list
        }
        item.value = '';
    }
});

function completeTask(element){
    //changing the style on click
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);

    
    
    thingsRef.doc(element.id).get().then(function(doc) {
        let DONE = doc.data().done ? false : true;

        thingsRef.doc(element.id).update({
            'done': DONE
        });       
    });
}

function removeTask(element){
    element.parentNode.parentNode.removeChild(element.parentNode);//removing from html 

    thingsRef.doc(element.id).update({
        'trash': true
    });
}
list.addEventListener('click', function(event){
    const element = event.target;//setting element based on where you clicked
    const elementJob = element.attributes.job.value;//getting the job of an element

    if(elementJob == 'complete'){
        completeTask(element);
    }else if(elementJob == 'delete'){
        removeTask(element);
    }

});

unsubscribe = thingsRef.orderBy('timestamp')
    .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map(doc => {
            if(doc.data().trash) {return;}

            const DONE = doc.data().done ? CHECK : UNCHECK;
            const LINE = doc.data().done ? LINE_THROUGH : '';
            return `<li>
            <i class="far ${DONE} co" job="complete" id="${doc.id}"></i></i>
            <p class="text ${LINE}">${doc.data().name}</p>
            <i class="fas fa-trash de" job="delete" id="${doc.id}"></i>
            </li>`;
        });
        
         //if trash is true item won't be shown
        list.innerHTML = items.join(' ');
    });

//Scrolling
const contentScroll = document.querySelector('.content');
contentScroll.onscroll = function(){
    let progress = document.querySelector('#progressbar');
    
    let totalHeight = contentScroll.scrollHeight - contentScroll.offsetHeight;
    let progressHeight = (contentScroll.scrollTop / totalHeight) * 100;
    progress.style.height = `${progressHeight}%`;
}