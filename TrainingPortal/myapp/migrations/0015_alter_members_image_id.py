# Generated by Django 4.1.1 on 2022-10-09 09:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0014_alter_members_image_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='members',
            name='image_id',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='myapp.uploadimage'),
            preserve_default=False,
        ),
    ]
