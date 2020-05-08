from django.db import models
from django.contrib.auth.models import User
from djrichtextfield.models import RichTextField
from django.utils import timezone

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

class AppUser(models.Model):
    user_profile = models.OneToOneField(User, on_delete=models.CASCADE)
    user_role = models.IntegerField(choices = USER_ROLE, default = 1)
    #email = models.OneToOneField(User.email, on_delete=models.CASCADE)
    #password = models.OneToOneField(User.password)
    def __str__(self):
        return self.user_profile.username

class Project(models.Model):
    name = models.CharField(max_length = 200)
    wiki = RichTextField()
    status = models.IntegerField(choices = STATUS_CHOICES, default = 1)
    #leader = models.ManyToMany(AppUser, related_name='mentor')
    creator = models.ForeignKey(AppUser, related_name='creator', on_delete=models.CASCADE)
    members = models.ManyToManyField(AppUser, related_name='members_working', blank=True)
    created_at = models.DateTimeField(auto_now_add = True)
    def __str__(self):
        return self.name

class Issues(models.Model):
    title = models.CharField(max_length=200)
    description = RichTextField()
    bug_status = models.IntegerField(choices = BUG_STATUS, default = 1)
    reported_by = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='reported_by')
    assigned_to = models.ForeignKey(AppUser, on_delete=models.SET_NULL, blank=True, null=True, related_name='assigned_to')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_at = models.DateTimeField(editable=False)
    tag = models.IntegerField(choices = TAG_OPTIONS, default = 1)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()
        return super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.title

class Comment(models.Model):
    issue = models.ForeignKey(Issues, related_name='issue', on_delete=models.CASCADE)
    comment = RichTextField()
    created_at = models.DateTimeField(auto_now_add = True) 
    commented_by = models.ForeignKey(AppUser, related_name='commented_by', on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        super(Comment, self).save(*args, **kwargs)

    def __str__(self):
        return self.comments

class Image(models.Model):
    comment = models.ForeignKey(Comment, on_delete = models.CASCADE)
    image = models.FileField(blank=True)
