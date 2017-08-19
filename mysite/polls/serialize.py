import re,os

def order_name(name):
    name = re.sub(r'^.*/', '', name)
    if len(name) <= 20:
        return name
    return name[:10] + "..." + name[-7:]




def serialize_file(instance,size):
    
    return {
     
        'name':order_name(instance),
        'size':size,
        'fullname':instance,
    }
    


def serialize_folder(instance):
    
    #index=instance.folder_name.rfind('/')
    index=instance.rfind('/')
    #folderName=instance.folder_name[index+1:]
    folderName=instance[index+1:]

    return {
        'name':instance,
    }
