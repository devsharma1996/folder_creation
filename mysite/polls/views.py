from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from .models import EkFile
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from .serialize import serialize_file,serialize_folder,order_name
import json,os,shutil
# Create your views here.

base_path=settings.MEDIA_ROOT

@ensure_csrf_cookie
def upload(request):
    if request.method=='POST':
    	
    	breadcrumb=request.POST['breadcrumb']
    	fullPath=base_path+"/"+breadcrumb+"/"
    	handle_uploaded_file(request.FILES['files'],fullPath)
    	values=serialize_file(request.POST['filename'],request.POST['filesize'])
        data={"files":values}
        response=json.dumps(data)
        print (response)
        return HttpResponse(response,content_type="application/json")
        

def handle_uploaded_file(f,fullPath):
	fileName=f.name
	with open(fullPath+fileName,'wb+') as destination:
		for chunk in f.chunks():
			destination.write(chunk)
	



@ensure_csrf_cookie
def upload_folder(request):
    
    if request.method=='POST':
         breadcrumb=request.POST['breadcrumb']
         fullPath=base_path+"/"+breadcrumb+"/"
   	 folderName=request.POST['folder']
         try:
         	os.makedirs(fullPath+folderName)
         except:
            	return HttpResponse(json.dumps({"error":"This folder already exists"}),content_type="application/json")

    return HttpResponse(json.dumps({"id":4}),content_type="application/json")    
        
@ensure_csrf_cookie
def index(request):
    return render(request,'polls/index.html')

@ensure_csrf_cookie
def rename_folder(request):
    print ("BreadCrumbs: "+request.POST['breadcrumb'])
    breadcrumb=request.POST['breadcrumb']
    fullPath=base_path+"/"+breadcrumb+"/"
    newName=request.POST['newName']
    oldName=request.POST['oldName']
    try:
    	os.rename(fullPath+oldName,fullPath+newName)
    except:
    	return HttpResponse(json.dumps({"error":"This folder already exists"}),content_type="application/json")
    return HttpResponse(json.dumps({"id":4}),content_type="application/json")

@ensure_csrf_cookie
def list_the_files(request):
    folders=False

    print "The base path is: "+base_path
    print ("BreadCrumbs: "+request.POST['breadcrumb'])
    
    breadcrumb=request.POST['breadcrumb']
    fullPath=base_path+"/"+breadcrumb+"/"
    if not os.path.exists(fullPath):
    	os.makedirs(fullPath)
    list_of_files=os.listdir(fullPath)
    if not list_of_files:
    	data={"None":True}
    else:
    	list_of_files.sort()
    	
    	for instance in list_of_files:
    		if os.path.isdir(fullPath+instance):
    			folders=True
    			break
    	if folders:
    		values=[serialize_folder(instance) for instance in list_of_files]
    		data={"folders":values}
    	else:
    		
    		values=[serialize_file(instance,os.stat(fullPath+instance).st_size) for instance in list_of_files]
    		data={"files":values}
    	    		
    response=json.dumps(data)
    print (response)
    return HttpResponse(response,content_type="application/json")     
        
        

@ensure_csrf_cookie
def delete_files(request):
    print ("Delete this file: "+request.POST['id'])
    breadcrumb=request.POST['breadcrumb']
    fullPath=base_path+"/"+breadcrumb+"/"
    fileName=request.POST['id']
    os.remove(fullPath+fileName)
    if len(os.listdir(fullPath))==0:
    	return HttpResponse(json.dumps({"None":True}),content_type="application/json")
    return HttpResponse(json.dumps({"files":True}),content_type="application/json")


@ensure_csrf_cookie
def delete_folder(request):
    print ("BreadCrumbs: "+request.POST['breadcrumb'])
    breadcrumb=request.POST['breadcrumb']
    fullPath=base_path+"/"+breadcrumb+"/"
    folderName=request.POST['folder']
    print "The folder to be deleted is :"+folderName
    shutil.rmtree(fullPath+folderName)
    return HttpResponse(json.dumps({"id":4}),content_type="application/json")
