# Generated by Django 4.1.1 on 2022-10-08 09:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0006_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='members',
            name='image',
            field=models.ImageField(default='', upload_to=''),
        ),
    ]
