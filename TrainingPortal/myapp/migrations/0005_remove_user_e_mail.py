# Generated by Django 4.1.1 on 2022-10-04 15:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0004_user_alter_members_designation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='e_mail',
        ),
    ]