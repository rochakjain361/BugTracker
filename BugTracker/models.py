from django.db import models
from django.contrib.auth.models import AbstractUser
from djrichtextfield.models import RichTextField
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
# Create your models here.

STATUS_CHOICES = (
        (1, 'Under Development'),
        (2, 'Testing'),
        (3, 'Released')
)
BUG_STATUS = (
        (1, 'Pending'),
        (2, 'To be Discussed'),
        (3, 'Resolved')
)
USER_ROLE = (
        (1, 'Normal User'),
        (2, 'Admin')
)
TAG_OPTIONS = (
        (1, 'Bug'),
        (2, 'Enhancement'),
        (3, 'UI/UX Improvement')
)

class AppUser(AbstractUser):
    user_role = models.IntegerField(choices = USER_ROLE, default = 1)
    display_picture = models.CharField(max_length=500)
    enrNo = models.IntegerField(default=0)
    access_token = models.CharField(max_length=100, default='', blank=True)
    is_disabled = models.BooleanField(default=0)
    def __str__(self):
        return self.get_username()

class Project(models.Model):
    name = models.CharField(max_length = 200)
    wiki = RichTextField()
    status = models.IntegerField(choices = STATUS_CHOICES, default = 1)
    creator = models.ForeignKey(AppUser, related_name='creator', on_delete=models.SET_NULL, null=True)
    members = models.ManyToManyField(AppUser, related_name='members_working')
    created_at = models.DateTimeField(auto_now_add = True)
    def __str__(self):
        return self.name

    def remove_members(self, member):
        member_to_remove = AppUser.objects.filter(AppUser = self.member)
        

class Issues(models.Model):
    title = models.CharField(max_length=200)
    description = RichTextField()
    bug_status = models.IntegerField(choices = BUG_STATUS, default = 1)
    reported_by = models.ForeignKey(AppUser, on_delete=models.SET_NULL, related_name='reported_by', null=True)
    assigned_to = models.ForeignKey(AppUser, on_delete=models.SET_NULL, blank=True, null=True, related_name='assigned_to')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add = True)
    tag = models.IntegerField(choices = TAG_OPTIONS, default = 1)

    def __str__(self):
        return self.title

class Comment(models.Model):
    issue = models.ForeignKey(Issues, related_name='issue', on_delete=models.CASCADE)
    comment = RichTextField()
    created_at = models.DateTimeField(auto_now_add = True) 
    commented_by = models.ForeignKey(AppUser, related_name='commented_by', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.comment
        
def upload_path(instance, filename):
        return '/'.join(['issue', filename])

class IssueImages(models.Model):
        issue = models.ForeignKey(Issues, on_delete = models.CASCADE)
        image = models.ImageField(blank = True, null = True, upload_to = upload_path)