// variable for storing the current location
var breadcrumb="Home";

document.addEventListener("DOMContentLoaded",listingItems);


//function for getting CSRF token

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



//function for listing the files or folders

function listingItems(event){
    var xhr=new XMLHttpRequest();
    document.getElementById("list-of-folders").innerHTML="";
    document.getElementById("list-of-files").innerHTML="";
    xhr.open("POST","list_the_files/");
    xhr.onreadystatechange=function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
            var obj=JSON.parse(xhr.responseText);
            
            // if obj has folders then list the folder else list the files
            if(obj.hasOwnProperty('folders')){
               console.log(obj.folders);
               displayButton('folders');
                var folder=obj.folders;
               //Parse the json here to display folders
                var folders="";
                for (i in folder){
                    console.log(folder[i]);
                    folders+="<div class='col-sm-3'><img class='img-responsive' width='98' height='102' src='/static/polls/images/folder.jpg'><div>"+folder[i].name+"</div></div>";
                }
               console.log("Have been called");
               document.getElementById("list-of-folders").innerHTML+=folders;

            }
            else if(obj.hasOwnProperty('files')){
               console.log(obj.files);
               displayButton('files');
                //Parse the json here to display files
                for(var i=0;i<obj.files.length;i++){
             		var row = $("<tr></tr>");
             		col1 = $("<td style='width:50%'>"+obj.files[i].name+"</td>");
             		col2 = $("<td>"+(obj.files[i].size/1024).toFixed(2)+"KB</td>");
             		col3 = $("<td><input type='checkbox' name='delete-service' value='"+obj.files[i].fullname+"'></td>");
             		row.append(col1,col2,col3).prependTo("#list-of-files");
    
               }
           }
           else
           	displayButton('None');
       }
    };
    
    //form for saving the breadcrumb and sending it along with POST
    var formData=new FormData();
    formData.append("breadcrumb",breadcrumb);
    
    var csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send(formData);
    
}


//function for hiding the Add Files or Add Folders or Delete buttons respectively

function displayButton(tag){
	if(tag=="files"){
		//Hide the Add Folders button and display the Add Files and Delete Button
		document.getElementById("folderupload-button").style.display="none";
		document.getElementById("fileupload-button").style.display="inline";
		document.getElementById("filedelete-button").style.display="inline";
		}
		
	else if(tag=="folders"){
		//Hide the Add Files and Delete button and diplay the Add Folders Button
		document.getElementById("fileupload-button").style.display="none";
		document.getElementById("folderupload-button").style.display="inline";
		document.getElementById("filedelete-button").style.display="none";
		}
	else{
	        //Hide the Delete button and diplay the Add Folders and Delete Button
		document.getElementById("fileupload-button").style.display="inline";
		document.getElementById("folderupload-button").style.display="inline";
		document.getElementById("filedelete-button").style.display="none";
		}

}



// functionality when a user clicks on breadcrumbs which is 'a' tag



document.addEventListener("click",function(event){
    toggleMenuOff();
    if(event.target.tagName=="A" && event.target.parentElement.parentElement.nodeName=="OL"){
    console.log("Clicking li");
    var target=event.target;
    var array_of_directory=breadcrumb.split("/");
    breadcrumb="Home";
    document.getElementById("directory-structure").innerHTML="<li><a href='#'>Home</a></li>";
    console.log(array_of_directory);
    if(target.textContent!="Home"){
    for(var i=1;i<array_of_directory.length;i++){
        breadcrumb+="/"+array_of_directory[i]; 

        if(array_of_directory[i]==target.textContent){
            document.getElementById("directory-structure").innerHTML+="<li class='active'><a href='#' >"+array_of_directory[i]+"</a></li>";
            break;
        }
        document.getElementById("directory-structure").innerHTML+="<li><a href='#'>"+array_of_directory[i]+"</a></li>";
     }
        
    }
    //display the items inside clicked folder    
    listingItems();
   }
    
});


// functionality for folder creation

document.querySelector("#folderupload-button").addEventListener("click",function(event){
    toggleMenuOff();
    var name=prompt("Enter the folder name:");
    if(name!="" && name!=null){
    
    
        
    // POST ajax request to upload_folder
    var xhr=new XMLHttpRequest();
    xhr.open("POST","upload_folder/");
    xhr.onreadystatechange=function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
            var obj=JSON.parse(xhr.responseText);
            
            if(obj.hasOwnProperty('error')){
               alert(obj.error);

            }
            else{
            	listingItems();
            }
                       
       }
    };
    
    //form for saving the breadcrumb and sending it along with POST
    var formData=new FormData();
    formData.append("breadcrumb",breadcrumb);
    formData.append("folder",name)
    var csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send(formData);
        
        
    }
});




// functionality for renaming folder

function rename_folder(){
    var name=prompt("Enter the folder name:");
    if(name!="" && name!=null){
        console.log(folder_selected);
    //folder_selected.textContent=name;
    console.log(folder_selected.previousSibling);
    var xhr=new XMLHttpRequest();
    xhr.open("POST","rename_folder/");
    xhr.onreadystatechange=function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var obj=JSON.parse(xhr.responseText);
            
            if(obj.hasOwnProperty('error')){
               alert(obj.error);

            }
            else{
            	listingItems();
            }
       }
    };
    
    //form for saving the breadcrumb and sending it along with POST
    var formData=new FormData();
    formData.append("breadcrumb",breadcrumb);
    formData.append("newName",name);
    formData.append("oldName",folder_selected.textContent);
    
    var csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send(formData);
    
        
      }   
}


// functionality for removing folder

function remove_folder(){
    //delete key[folder_selected];
    //display_folders(key);
    var xhr=new XMLHttpRequest();
    xhr.open("POST","delete_folder/");
    xhr.onreadystatechange=function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
            listingItems();
       }
    };
    
    //form for saving the breadcrumb and sending it along with POST
    var formData=new FormData();
    formData.append("breadcrumb",breadcrumb);
    formData.append("folder",folder_selected.textContent);
    //formData.append("oldname",breadcrumb+"/"+folder_selected.textContent);
    
    var csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send(formData);
}


// initialization of context-menu with the functions for renaming and removing

(function(elem){
    elem.onEdit = rename_folder;
    elem.onDelete = remove_folder;
})(document.getElementById('context-menu__items'));


// functionality for calling rename_folder() and remove_folder() function on click on the options inside context-menu

document.querySelector('.context-menu > .context-menu__items').addEventListener("click",function(event){
    console.log(this);
    console.log(event.target);
    var action=event.target.getAttribute('data-action');
    console.log(action);
    this["on"+action]();
});






// functionality for double-clicking a folder


document.addEventListener('dblclick',function(event){
    toggleMenuOff();
    var target=event.target;
    console.log(target.tagName);
    console.log(target.nextSibling.textContent);
    if(target.tagName=="IMG"){
        
        breadcrumb+="/"+target.nextSibling.textContent;
        // list the items inside this folder
        listingItems();
        document.getElementById("directory-structure").innerHTML+="<li><a href='#'>"+target.nextSibling.textContent+"</a></li>";
    }
});



var tapped=false;

document.addEventListener('touchstart',function(event){
	toggleMenuOff();
	var touchobj=event.changedTouches[0]
	var target=event.target;
	console.log(target.tagName);
	//console.log(target.nextSibling.textContent);
	if(target.tagName=="IMG"){
	
	
		if(!tapped){
			tapped=setTimeout(function(){
				tapped=null;
				
        
			},300);
		
		}
		else{
			clearTimeout(tapped);
			tapped=null;
			breadcrumb+="/"+target.nextSibling.textContent;
        		// list the items inside this folder
        		listingItems();
        		document.getElementById("directory-structure").innerHTML+="<li><a href='#'>"+target.nextSibling.textContent+"</a></li>";
		
		}
		
	}

});
