# Generated by Django 3.0.7 on 2020-06-29 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BugTracker', '0010_auto_20200628_2329'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.ImageField(null=True, upload_to='./media'),
        ),
    ]
