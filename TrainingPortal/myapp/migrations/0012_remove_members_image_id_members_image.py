# Generated by Django 4.1.1 on 2022-10-09 09:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0011_remove_members_image_members_image_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='members',
            name='image_id',
        ),
        migrations.AddField(
            model_name='members',
            name='image',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='myapp.uploadimage'),
        ),
    ]