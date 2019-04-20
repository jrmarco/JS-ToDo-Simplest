# JS-ToDo-Simplest
This package provide a ready-made and customizable "To Do" component, with alerts/push, using browser's local storage as persistent solution. Since Local Storage is required, the application will work only if the browser itself support the local storage content

## Requirements

- browser with Local Storage: check this link to see which browsers support it, https://caniuse.com/#feat=namevalue-storage
- jQuery, jQuery-ui, Bootstrap: all scripts are included in the header/footer of the todo.html file
- function.js: contains the required functions to interact with the component

## Screenshots

![Main](https://bigm.it/assets/media/jstodo-main.png)
![Sample](https://bigm.it/assets/media/jstodo-sample.png)

## Installation

1. Copy or clone the repository
2. Use the component as it is or copy-paste the code snippet from body where you need it, paying attention to include in the "page" that holds the code all the required scripts
3. Be sure that function.js file is accessible from the todo.html file or include it in the "page" that contains the code snipped

## Data stored

All user provided data is stored in the USER BROWSER only and cannot be accessed outside the same origin nor from external resource; only within the page. The Local Storage can be access via JS using the localStorage attribute (doc: https://www.w3.org/TR/webstorage/). Tasks are stored in a JSON structure: it's an array of object, each object represent a task ( task (object) : {id,title,description,datetime,status,push} ). This data is presistent and will be available even after the current session ends.

## Explanation

The component offer a To Do list with push/alert notification, using the Bootstrap and jQuery library. 

1. First check, done by the script, is to verify the Local Storage availability; if L.S. is not available the script will fail and an allert will be printed in the page
2. The tasks list is initialized: script will fetch existing elements in the Local Storage and will create elements for each event
3. If tasks are available in the local storage, for each "expired" event (not yet notified) a toast message will be created to inform the user about it. Toast message will appear until the user close it.
4. At this point, script has initialized every required init pending. User is free to create new alert. Page will reaload automatically every 5 minutes ( value can be set on the todo.html in the meta definition or totally removed and customised )
5. Tasks displayed in the list can be "marked": 
    - "sign" icon button: each click will change is mark status, cycling into four states (standard:white, completed:green, pending:yellow, error:red)
    - "delete" icon button: delete the task from the application

## Create Task

1. Using the "Add activity" button, a little form will be shown
2. Form inputs:
    1. Activity title: is the task title
    2. Textarea: is the note/description of the task (optional)
    3. Datetime: a date picker and a time selector (optional)
3. The "Store" button will save the task in the Local Storage
4. Alert/Push notification will be active only if the provided datetime was valid nor not empty

## Clean Local Storage

The "Clear all" button will remove all data from the Local storage

# DISCLAIMER
 I'm not responsible for any issue related nor caused by this component that could or would affect your environment and/or business.