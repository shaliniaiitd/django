# Generated by Django 4.1.1 on 2022-10-08 22:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0008_uploadimage_alter_members_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='members',
            name='image',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.uploadimage'),
        ),
    ]
