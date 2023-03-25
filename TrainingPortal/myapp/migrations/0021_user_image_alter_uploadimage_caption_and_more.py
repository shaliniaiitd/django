# Generated by Django 4.1.1 on 2022-10-09 10:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0020_alter_uploadimage_caption'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='image',
            field=models.ImageField(null=True, upload_to='images'),
        ),
        migrations.AlterField(
            model_name='uploadimage',
            name='caption',
            field=models.CharField(default=' ', max_length=200),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='uploadimage',
            name='image',
            field=models.ImageField(upload_to='images'),
        ),
    ]
