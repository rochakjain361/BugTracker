# Generated by Django 3.0.6 on 2020-05-22 15:50

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BugTracker', '0005_auto_20200519_0308'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='members',
            field=models.ManyToManyField(related_name='members_working', to=settings.AUTH_USER_MODEL),
        ),
    ]