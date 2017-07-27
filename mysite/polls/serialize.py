import re

def order_name(name):
    name = re.sub(r'^.*/', '', name)
    if len(name) <= 20:
        return name
    return name[:10] + "..." + name[-7:]




def serialize(instance):
    
    return {
        'thumbnailUrl':instance.file.url,
        'name':order_name(instance.file.name),
        'size':instance.file.size,
        'id':instance.id,
    }

def serialize_folder(instance):
    
    index=instance.folder_name.rfind('/')
    folderName=instance.folder_name[index+1:]
    
    return {
        'name':folderName,
    }