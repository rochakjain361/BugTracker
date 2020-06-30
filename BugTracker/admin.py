from django.contrib import admin

from .models import *

admin.site.register(AppUser)
admin.site.register(Project)
admin.site.register(Issues)
admin.site.register(Comment)
# Register your models here.
