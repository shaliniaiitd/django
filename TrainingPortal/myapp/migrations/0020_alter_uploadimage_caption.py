# Generated by Django 4.1.1 on 2022-10-09 10:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0019_alter_uploadimage_caption'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadimage',
            name='caption',
            field=models.CharField(max_length=200, null=True),
        ),
    ]