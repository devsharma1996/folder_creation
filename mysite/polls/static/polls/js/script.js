var count=0;

// input tag of type 'file' of id="browse"
document.querySelector("#browse").addEventListener("change",function(event){
    

    
    for(var i=0;i<this.files.length;i++){
        console.log(this.files.item(i).name);
        new FileUpload(this.files.item(i),i,Date.now());
        console.log(this.files.item(i));
        console.log(this.files.item(i).type);
    }
    
    


});


function FileUpload(file,i,date){
    
    var formData=new FormData(); 
    console.log(date);
    var xhr=new XMLHttpRequest();

    
   var row = $("<tr class='"+date+"'></tr>");
   col1 = $("<td style='width:50%'>"+file.name+"</td>");
   col2 = $("<td style='width:30%'>"+"<div class='progress'><div class='progress-bar progress-bar-success progress-bar-striped' role='progressbar' style='width: 0%' aria-   valuenow='0' aria-valuemin='0' aria-valuemax='100'></div></div></td>");
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
      }, false);
    formData.append('files',file);
    formData.append('breadcrumb',breadcrumb);
    formData.append('filename',file.name);
    formData.append('filesize',file.size);
    
     xhr.open("POST","upload/");
    xhr.onreadystatechange=function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
           console.log(xhr.responseText);
            var obj=JSON.parse(xhr.responseText);
            console.log(obj.files);
            displayButton('files');
            
            $('.'+date).replaceWith("<tr><td>"+obj.files.name+"</td><td>"+(obj.files.size/1024).toFixed(2)+"KB</td><td><input type='checkbox' name='delete-service' value='"+obj.files.fullname+"'></td></tr>");
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
           console.log(xhr.responseText);
           var obj=JSON.parse(xhr.responseText);
           console.log(obj.files);
           if(obj.hasOwnProperty('files'))
           	displayButton('files');
           else
           	displayButton('None');
       }
    };
       
       var formData=new FormData();
       formData.append("id",checkbox.value);
       formData.append('breadcrumb',breadcrumb);
       var csrftoken = getCookie('csrftoken');
       xhr.setRequestHeader("X-CSRFToken", csrftoken);
       xhr.send(formData); 
    }
    
});
