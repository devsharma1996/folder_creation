document.addEventListener("DOMContentLoaded",function(event){
    var xhr=new XMLHttpRequest();
    xhr.open("GET","list_the_files/");
    var csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.onreadystatechange=function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
           console.log(xhr.responseText);
           var obj=JSON.parse(xhr.responseText);
           console.log(obj.files);
           for(var i=0;i<obj.files.length;i++){
             var row = $("<tr></tr>");
             col1 = $("<td style='width:50%'>"+obj.files[i].name+"</td>");
             col2 = $("<td>"+(obj.files[i].size/1024).toFixed(2)+"KB</td>");
             col3 = $("<td><input type='checkbox' name='delete-service' value='"+obj.files[i].id+"'></td>");
             row.append(col1,col2,col3).prependTo("#list-of-files");
    
           }  
       }
    };
    xhr.send(null);
});

var count=0;

/*function getCookie(name) {
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
}*/

// input tag of type 'file' of id="browse"
document.querySelector("#browse").addEventListener("change",function(event){
    //Get's number of files and their filenames from file input element with multiple attribute
    var rows="";

    //var formData=new FormData(); 
    for(var i=0;i<this.files.length;i++){
        console.log(this.files.item(i).name);
        //toFixed() for displaying no with as no of decimal points
        //rows+="<tr><td>"+this.files.item(i).name+"</td><td>"+(this.files.item(i).size/1024).toFixed(2)+"KB</td><td><input type='checkbox' class='toggle'></td></tr>";
        //formData.append('files',this.files.item(i));
        new FileUpload(this.files.item(i),i,Date.now());
        console.log(this.files.item(i));
        console.log(this.files.item(i).type);
    }
    
    //var request=new XMLHttpRequest();
    //request.open("POST","http://127.0.0.1:8000/polls/upload/");
    //var csrftoken = getCookie('csrftoken');
    //request.setRequestHeader("X-CSRFToken", csrftoken);
    //request.send(formData);
    
    
    //document.querySelector(".list-of-files").innerHTML+=rows;


});


function FileUpload(file,i,date){
    
    var formData=new FormData(); 
    console.log(date);
    var xhr=new XMLHttpRequest();
   // var row="<tr class='"+date+"'><td>"+file.name+"</td><td style='width:40%'>"+"<div class='progress'><div class='progress-bar progress-bar-success progress-bar-striped' role='progressbar' style='width: 0%' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'></div></div></td><td>"+(file.size/1024).toFixed(2)+"KB</td></tr>";
    
   var row = $("<tr class='"+date+"'></tr>");
   col1 = $("<td style='width:50%'>"+file.name+"</td>");
   col2 = $("<td style='width:30%'>"+"<div class='progress'><div class='progress-bar progress-bar-success progress-bar-striped' role='progressbar' style='width: 0%' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'></div></div></td>");
   col3 = $("<td>"+(file.size/1024).toFixed(2)+"KB</td>");
   row.append(col1,col2,col3).prependTo("#list-of-files");
    
   // document.querySelector(".list-of-files").innerHTML+=row;
    xhr.upload.addEventListener("progress",function(e){
       if(e.lengthComputable){
           var percentage=Math.round((e.loaded*100)/e.total);
           $('.'+date+' .progress-bar').css('width', percentage+'%').attr('aria-valuenow', percentage); 
           console.log(file.name+" : "+ percentage);
       } 
    },false);
    
     xhr.upload.addEventListener("load", function(e){
          console.log(file.name+" is uploaded successfully");
         // var row="<tr class='"+date+"'><td>"+file.name+"</td><td>"+(file.size/1024).toFixed(2)+"KB</td><td><input type='checkbox' class='toggle'></td></tr>";
          //$('.'+date+' .progress').css('display','none'); 
         
    
         //$('.'+count+' .progress-bar').css('width', percentage+'%').attr('aria-valuenow', 100); 
      }, false);
    formData.append('files',file);
    
     xhr.open("POST","upload/");
    xhr.onreadystatechange=function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
           console.log(xhr.responseText);
            var obj=JSON.parse(xhr.responseText);
            console.log(obj.files);
            //console.log(document.querySelector("tr."+date).textContent);
            //document.querySelector("tr."+date).innerHTML="<td>"+obj.files.name+"</td><td>"+(obj.files.size/1024).toFixed(2)+"KB</td><td><input type='checkbox'></td>";
            $('.'+date).replaceWith("<tr><td>"+obj.files.name+"</td><td>"+(obj.files.size/1024).toFixed(2)+"KB</td><td><input type='checkbox' name='delete-service' value='"+obj.files.id+"'></td></tr>");
            console.log("Call back function callled");
       }
    };
    
    var csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send(formData);
    
 
    
}
// fileinput button
document.querySelector("#fileupload-button").addEventListener("click",function(event){
   var fileinput=document.getElementById("browse");
   fileinput.click();
});



//delete button
document.querySelector("#filedelete-button").addEventListener("click",function(event){
   var checkboxes=document.getElementsByName("delete-service");
    length=checkboxes.length;
    var checkboxesChecked=[];
    for(var i=0;i<length;i++){
        if(checkboxes[i].checked){
           console.log("file with id :"+checkboxes[i].value+" is to be deleted");
            checkboxesChecked.push(checkboxes[i]);
          // checkboxes[i].parentElement.parentElement.parentElement.removeChild(checkboxes[i].parentElement.parentElement);
            
        }
    }
    
    for(var i=0;i<checkboxesChecked.length;i++){
        
        new filedelete(checkboxesChecked[i]);    
    }
    
    function filedelete(checkbox){    
        var xhr=new XMLHttpRequest();
        xhr.open("POST","delete_files/");
        xhr.onreadystatechange=function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
           checkbox.parentElement.parentElement.parentElement.removeChild(checkbox.parentElement.parentElement);
       }
    };
       
       var formData=new FormData();
       formData.append("id",checkbox.value);
       var csrftoken = getCookie('csrftoken');
       xhr.setRequestHeader("X-CSRFToken", csrftoken);
       xhr.send(formData); 
    }
    
});



var root=new Object();
var breadcrumbs="Home";
var key=root;
document.querySelector("#folderupload-button").addEventListener("click",function(event){
    toggleMenuOff();
    var name=prompt("Enter the folder name:");
    if(name!="" && name!=null){
    key[name]=new Object();
    var folders="<div class='col-sm-3'><img class='img-responsive' width='98' height='102' src='images/folder.jpg'><div>"+name+"</div></div>";
    document.getElementById("list-of-folders").innerHTML+=folders;
    console.log(root);
    console.log(key);
    
    }
});



function rename_folder(){
    var name=prompt("Enter the folder name:");
    if(name!="" && name!=null){
        if (name !== folder_selected) {
            Object.defineProperty(key, name,
            Object.getOwnPropertyDescriptor(key, folder_selected));
            delete key[folder_selected];
      }    
    }
}

function remove_folder(){
    delete key[folder_selected];
    display_folders(key);
}



(function(elem){
    elem.onEdit = rename_folder;
    elem.onDelete = remove_folder;
})(document.getElementById('context-menu__items'));


document.querySelector('.context-menu > .context-menu__items').addEventListener("click",function(event){
    console.log(this);
    console.log(event.target);
    var action=event.target.getAttribute('data-action');
    console.log(action);
    this["on"+action]();
});





document.addEventListener("click",function(event){
    toggleMenuOff();
    if(event.target.tagName=="A"){
    key=root;
    console.log("Clicking li");
    var target=event.target;
    var array_of_directory=breadcrumbs.split("/");
    breadcrumbs="Home";
        document.getElementById("directory-structure").innerHTML="<li><a href='#'>Home</a></li>";
        console.log(array_of_directory);
    if(target.textContent!="Home"){
    for(var i=1;i<array_of_directory.length;i++){
        breadcrumbs+="/"+array_of_directory[i]; 

        if(array_of_directory[i]==target.textContent){
            key=key[array_of_directory[i]];
            document.getElementById("directory-structure").innerHTML+="<li class='active'><a href='#' >"+array_of_directory[i]+"</a></li>";
            break;
        }
        else
            key=key[array_of_directory[i]];
        document.getElementById("directory-structure").innerHTML+="<li><a href='#'>"+array_of_directory[i]+"</a></li>";
     }
        
    }
    console.log(key);
    //display the folders inside clicked bar    
    display_folders(key);
   }
    
});


document.addEventListener('dblclick',function(event){
    toggleMenuOff();
    var target=event.target;
    console.log(target.tagName);
    console.log(target.nextSibling.textContent);
    if(target.tagName=="IMG"){
        //document.getElementById("list-of-folders").innerHTML="";
        key=key[target.nextSibling.textContent];
        breadcrumbs+="/"+target.nextSibling.textContent;
        display_folders(key);
        console.log(root);
        console.log(key);
        document.getElementById("directory-structure").innerHTML+="<li><a href='#'>"+target.nextSibling.textContent+"</a></li>";
    }
});


function display_folders(key){
    document.getElementById("list-of-folders").innerHTML="";
    for( var property in key){
        if(key.hasOwnProperty(property)){
            console.log(property);
            var folders="<div class='col-sm-3'><img class='img-responsive' width='98' height='102' src='images/folder.jpg'><div>"+property+"</div></div>";
            document.getElementById("list-of-folders").innerHTML+=folders;

        }
    }
}




