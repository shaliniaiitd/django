# Generated by Django 4.1.1 on 2022-10-09 09:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0013_rename_image_members_image_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='members',
            name='image_id',
            field=models.ForeignKey(default='', null=True, on_delete=django.db.models.deletion.CASCADE, to='myapp.uploadimage'),
        ),
    ]