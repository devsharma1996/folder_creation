from django.db import models

# Create your models here.

class Folder(models.Model):
    folder_name=models.CharField(max_length=250,blank=True)
    last_folder=models.BooleanField(default=True)
    #many to one relationship folder and folder i.e. many folders inside a folder
    folder_pointing=models.ForeignKey('self',null=True)
    
    def __str__(self):
        return self.folder_name+","+str(self.last_folder)+"->"+str(self.folder_pointing)
    
    def save(self, *args, **kwargs):
        super(Folder, self).save(*args, **kwargs)
    
    def delete(self,*args,**kwargs):
        super(Folder,self).delete(*args,**kwargs)



class EkFile(models.Model):
    file = models.FileField(upload_to="")
    slug = models.SlugField(max_length=50, blank=True)
    type_of_file=models.CharField(max_length=50,blank=True)
    path_of_file=models.CharField(max_length=250,blank=True)
    #many to one relationship between file and folder
    folder=models.ForeignKey(Folder,on_delete=models.CASCADE)

    def __str__(self):
        return self.file.name+","+self.type_of_file+","+self.path_of_file+","+self.folder
   
    def save(self, *args, **kwargs):
        self.slug = self.file.name
        index=self.slug.rfind('.')
        self.type_of_file=self.slug[index+1:]
        self.path_of_file=self.file.path
        print (self.path_of_file)
        super(EkFile, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """delete -- Remove to leave file."""
        self.file.delete(False)
        super(EkFile, self).delete(*args, **kwargs)


