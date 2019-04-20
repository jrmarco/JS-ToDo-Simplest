/**
 * JS-ToDo-Simplest : v.1.0
 */

/**
 * init function
 * @return void
 */
window.onload = function() {
	verifyLocalStorage();
	if(window.blnLocalStorage) {
		initListElement();
		checkAlert();
		initTimeSelect();
		$('[data-toggle="tooltip"]').tooltip();
		$( "#date" ).datepicker({dateFormat: "yy-mm-dd"});
	}
};

/**
 * Retrieve tasks from the local storage
 * Tasks are stored, as JSON, in the "activities" item inside the Local Storage
 * @return void
 */
function initListElement() {
	let arrData = [];
	if(localStorage.getItem('activities')!==null) {
		ls 		= localStorage.getItem('activities');
		arrData = JSON.parse(ls);
	}

	for(let elem of arrData) {
		appendElement(elem);
	}
}

/**
 * Enable toast message for expired tasks
 * Retrieve tasks from the local storage, for each, check the datetime value and the push status. 
 * If actual time is bigger then stored datetime (planned date-time has passed) and 
 * push status is inactive, a toast is created
 * @return void
 */
function checkAlert() {
	let updatedArr = [];
	if(localStorage.getItem('activities')!==null) {
		ls 		     = localStorage.getItem('activities');
		arrData      = JSON.parse(ls);

		actualDatetime = new Date();
		for(let elem of arrData) {
			if(elem.datetime!==null && actualDatetime.getTime()>elem.datetime && elem.push==0) {
				createToast(elem);
			}
			updatedArr.push(elem);
		}

		localStorage.setItem('activities',JSON.stringify(updatedArr));
	}	
}

/**
 * Create a toast message for the given task
 * @param  {Object} elem Object representing the task
 * @return void
 */
function createToast(elem) {
	toast    = document.getElementById('toastTmp');
	newToast = toast.cloneNode(true);
	newToast.setAttribute('id','elemToast'+elem.id);
	buttons  = newToast.getElementsByClassName('button');
	buttons[0].setAttribute('onClick','closeToast(\'elemToast'+elem.id+'\')');
	titles   = newToast.getElementsByClassName('title');
	titles[0].innerHTML = decodeURIComponent(elem.title);
	bodies   = newToast.getElementsByClassName('toast-body');
	bodies[0].innerHTML = decodeURIComponent(elem.description)+'<br><br>'+
						  '<span style="font-size:x-small;"><i>'+datetime.getFullYear()+'-'+(datetime.getMonth()+1)+'-'+datetime.getDate()+' @ '+datetime.getHours()+':'+datetime.getMinutes()+'</i></span>';
	$('#floatingTosts').append(newToast);
	$('#elemToast'+elem.id).toast({autohide:false});
	$('#elemToast'+elem.id).toast('show');	
}

/**
 * Function test the availability of the Local storage
 * In case L.S. is not available a boolean var is set to false for the whole application to block
 * any function
 * @return void
 */
function verifyLocalStorage() {
	ls = localStorage.setItem('test',1);
	if(localStorage.getItem('test')===null) {
		h2 = document.createElement('h2');
		h2.innerHTML = 'Your browser does not support Local Storage!';
		h2.style.color = 'red';
		h2.align = 'center';
		$('body').prepend(h2);
		window.blnLocalStorage = false;
	}
}

/**
 * Clear the Local Storage data
 * @return void
 */
function resetActivities() {
	if(window.blnLocalStorage){
		$('#ulActivities').html('');
		localStorage.clear();
		localStorage.setItem('index',0);
	}
}

/**
 * Show/Hide the form
 * @return void
 */
function formToggle() {
	if($('#form').hasClass('d-none')) {
		$('#form').removeClass('d-none');
	} else {
		$('#form').addClass('d-none');
	}
}

/**
 * Store the given information in the form field, as a task, in the Local Storage
 * Plain informations are converted into an object:
 * - a LI element is created to display and interact with the task
 * - object is stored as element into the array
 * - array is converted into JSON and stored in Local Storage
 * @return void
 */
function store() {
	title  		= $('#activity').val();
	description = $('#note').val();
	date   		= $('#date').val();
	time   		= $('#hour').val()+':'+$('#minute').val();

	if(window.blnLocalStorage) {
		if(title!='') {
			arrData = [];
			if(localStorage.getItem('activities')!==null) {
				ls 		= localStorage.getItem('activities');
				arrData = JSON.parse(ls);
			}

			let obj = {id:null,title:null,description:null,datetime:null,status:0,push:0}

			index		    = 0;
			if(localStorage.getItem('index')!==null) {
				index  = parseInt(localStorage.getItem('index'));
				index += 1;
				localStorage.setItem('index',index);
			}

			obj.id 			= index;
			obj.title 		= encodeURIComponent(title);
			obj.description = encodeURIComponent(description);
			splitDate		= date.split('-');
			splitTime		= time.split(':');
			obj.datetime    = new Date(splitDate[0],(splitDate[1]-1),splitDate[2],splitTime[0],splitTime[1]).getTime();
			if(obj.datetime=="NaN") { obj.datetime = null; }

			arrData.push(obj);
			localStorage.setItem('activities',JSON.stringify(arrData));

			li = createListElement(obj);
			document.getElementById('ulActivities').appendChild(li);

			$('#activity').val('');
			$('#note').val('');
			$('#date').val('');
			$('#hour').val('');
			$('#minute').val('');
			$('[data-toggle="tooltip"]').tooltip();
		}
	}
}

/**
 * Create a LI element for the given task
 * @param  {Object} elem Object representing the task
 * @return {li:element} A new LI element
 */
function createListElement(object) {
	li   = document.createElement('li');
	li.classList.add('list-group-item');
	li.setAttribute('id','elem'+object.id);

	main  = document.createElement('div');
	icons = document.createElement('div');

	main.innerHTML = decodeURIComponent(object.title);
	if(main.innerHTML.length>25) {
		main.innerHTML = main.innerHTML.substr(0,25)+'..';
			main.setAttribute('title','<b>'+decodeURIComponent(object.title)+'</b><br><br>'+decodeURIComponent(object.description));
	} else {
		main.setAttribute('title',decodeURIComponent(object.description));
	}

	main.setAttribute('data-toggle','tooltip');
	main.setAttribute('data-html','true');
	main.setAttribute('data-placement','left');

	if(object.datetime!=null && !isNaN(object.datetime)) {
		datetime = new Date(object.datetime);
		main.innerHTML += ' ('+datetime.getFullYear()+'-'+(datetime.getMonth()+1)+'-'+datetime.getDate()+' @ '+datetime.getHours()+':'+datetime.getMinutes()+')';
	}
	main.classList.add('d-inline');
	icons.classList.add('d-inline');

	completeIco = createIcon('elem'+object.id);
	deleteIco   = createIcon('elem'+object.id,'delete');

	icons.appendChild(completeIco);
	icons.appendChild(deleteIco);

	li.appendChild(main);
	li.appendChild(icons);

	return li;
}

/**
 * Create an image element
 * Image characteristics differ based on the "mode" param
 * @param  {String} elementName Task element identifier
 * @param  {String} mode String selector to identify type of image
 * @return {image:element} A new image element
 */
function createIcon(elementName,mode='complete') {
	ico  = document.createElement('img');
	ico.classList.add('d-inline');
	if('complete'==mode) {
		ico.classList.add('ml-3');
		ico.setAttribute('src','complete.png');
		ico.setAttribute('width','20px');
		ico.setAttribute('height','20px');
		ico.setAttribute('onClick','mark(\''+elementName+'\')');
	} else {
		ico.classList.add('ml-1');
		ico.setAttribute('src','delete.png');
		ico.setAttribute('width','15px');
		ico.setAttribute('height','15px');
		ico.setAttribute('onClick','remove(\''+elementName+'\')');
	}

	return ico;
}

/**
 * Append a LI element to the UL container
 * LI is bind with the task using the object information
 * @param  {Object} object Object representing the task
 * @return void
 */
function appendElement(object) {
	li = createListElement(object);
	li.classList = 'list-group-item';
	switch(object.status) {
		case 1 : li.classList.add('list-group-item-success'); break;
		case 2 : li.classList.add('list-group-item-warning'); break;
		case 3 : li.classList.add('list-group-item-danger'); break;
	}
	document.getElementById('ulActivities').appendChild(li);
}

/**
 * Remove the related element from the page
 * Task is removed also from the Local Storage
 * @param  {String} elementName Task element identifier
 * @return void
 */
function remove(elementName) {
	document.getElementById(elementName).remove();

	if(window.blnLocalStorage) {
		updatedArr = [];
		index   = elementName.substr(4,elementName.length-1);
		ls      = localStorage.getItem('activities');
		arrData = JSON.parse(ls);
		for(let elem of arrData) {
			if(elem.id!=index) {
				updatedArr.push(elem);
			}
		}

		localStorage.setItem('activities',JSON.stringify(updatedArr));
	}
}


/**
 * Set the mark/status of the task
 * @param  {String} elementName Task element identifier
 * @return void
 */
function mark(elementName) {
	updatedArr = [];

	if(window.blnLocalStorage) {
		index   = elementName.replace('elem','');
		ls      = localStorage.getItem('activities');
		arrData = JSON.parse(ls);

		for(let elem of arrData) {
			if(elem.id==index) {
				elem.status = (elem.status + 1)%4;
				li = document.getElementById(elementName);
				li.classList = 'list-group-item';
				switch(elem.status) {
					case 1 : li.classList.add('list-group-item-success'); break;
					case 2 : li.classList.add('list-group-item-warning'); break;
					case 3 : li.classList.add('list-group-item-danger'); break;
				}
			}
			updatedArr.push(elem);
		}

		localStorage.setItem('activities',JSON.stringify(updatedArr));	
	}
}

/**
 * Close the toast message
 * The relative task stored in the Local storage is updated and its push field is set to 1
 * @param  {String} toastName Toast element identifier
 * @return void
 */
function closeToast(toastName) {
	updatedArr = [];

	if(window.blnLocalStorage) {
		$('#'+toastName).toast('hide');
		index   = toastName.replace('elemToast','');
		ls      = localStorage.getItem('activities');
		arrData = JSON.parse(ls);

		for(let elem of arrData) {
			if(elem.id==index) { elem.push = 1; }
			updatedArr.push(elem);
		}

		localStorage.setItem('activities',JSON.stringify(updatedArr));	
	}
}

/**
 * Dynamically create the time options
 * @return void
 */
function initTimeSelect() {
	date = new Date();
	$('#date').val('');
	$('#hour').val('');
	$('#minute').val('');
	for(let i=0;i<60;i++) {
		opt = document.createElement('option');
		opt.value = i;
		if(i<10) { opt.value = '0'+i; }
		opt.innerHTML = i;
		if(date.getMinutes()==i) {
			opt.setAttribute('selected',true);
		}
		document.getElementById('minute').appendChild(opt);
	}
	for(let i=0;i<24;i++) {
		opt = document.createElement('option');
		opt.value = i;
		if(i<10) { opt.value = '0'+i; }
		opt.innerHTML = i;
		if(date.getHours()==i) {
			opt.setAttribute('selected',true);
		}
		document.getElementById('hour').appendChild(opt);
	}
	localStorage.setItem('hour',1);
	localStorage.setItem('minute',1);
}

