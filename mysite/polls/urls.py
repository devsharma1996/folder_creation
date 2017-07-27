from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^upload/$', views.upload, name='upload'),
    url(r'^upload_folder/$', views.upload_folder, name='upload_folder'),
    url(r'^rename_folder/$',views.rename_folder,name='rename_folder'),
    url(r'^list_the_files/$',views.list_the_files,name="list"),
    url(r'^delete_files/$',views.delete_files,name="delete_files"),
    url(r'^delete_folder/$',views.delete_folder,name="delete_folder"),
]