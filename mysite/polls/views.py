from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from .models import EkFile,Folder
from django.views.decorators.csrf import ensure_csrf_cookie
from .serialize import serialize,serialize_folder
import json
# Create your views here.

@ensure_csrf_cookie
def upload(request):
    if request.method=='POST':
        instance=EkFile(file=request.FILES['files'])
        obj=instance.save()
        print (instance)
        values=serialize(instance)
        data={"files":values}
        response=json.dumps(data)
        print (response)
        return HttpResponse(response,content_type="application/json")
        

@ensure_csrf_cookie
def upload_folder(request):
    if request.method=='POST':
        if request.POST['breadcrumb']=='Home':    
            folderName=request.POST['breadcrumb']+"/"+request.POST['name']
            instance=Folder(folder_name=folderName)
            instance.save()
        else:
            instance=Folder.objects.get(folder_name=request.POST['breadcrumb'])
            print (instance)
            instance.last_folder=False
            instance.save()
            folderName=request.POST['breadcrumb']+"/"+request.POST['name']
            obj=Folder(folder_name=folderName,folder_pointing=instance)
            obj.save()
            print (obj)
    return HttpResponse(json.dumps({"id":4}),content_type="application/json")    
        
@ensure_csrf_cookie
def index(request):
    return render(request,'polls/index.html')

@ensure_csrf_cookie
def rename_folder(request):
    instance=Folder.objects.get(folder_name=request.POST['oldname'])
    print (instance)
    instance.folder_name=request.POST['breadcrumb']
    instance.save()
    return HttpResponse(json.dumps({"id":4}),content_type="application/json")

@ensure_csrf_cookie
def list_the_files(request):
    print ("BreadCrumbs: "+request.POST['breadcrumb'])
    if request.POST['breadcrumb']=='Home':
        values=[serialize_folder(instance) for instance in Folder.objects.all().filter(folder_pointing=None)]
        data={"folders":values}
        response=json.dumps(data)
        print (response)
        return HttpResponse(response,content_type="application/json")
    else:
        obj=Folder.objects.get(folder_name=request.POST['breadcrumb'])
        print (obj)
        if(obj.last_folder==True):
            files=EkFile.objects.all().filter(folder=obj.id)
            values=[serialize(instance) for instance in files]
            data={"files":values}
            response=json.dumps(data)
            print (response)
            return HttpResponse(response,content_type="application/json")
        else:
            folders=Folder.objects.all().filter(folder_pointing=obj.id)
            values=[serialize_folder(instance) for instance in folders]
            data={"folders":values}
            response=json.dumps(data)
            print (response)
            return HttpResponse(response,content_type="application/json")
        
        

@ensure_csrf_cookie
def delete_files(request):
    print ("Delete this file: "+request.POST['id'])
    instance=EkFile.objects.get(id=request.POST['id'])
    print (instance)
    instance.delete()
    return HttpResponse(json.dumps({"id":4}),content_type="application/json")


@ensure_csrf_cookie
def delete_folder(request):
    instance=Folder.objects.get(folder_name=request.POST['breadcrumb'])
    print (instance)
    instance.delete();
    return HttpResponse(json.dumps({"id":4}),content_type="application/json")