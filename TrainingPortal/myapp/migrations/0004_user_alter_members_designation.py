# Generated by Django 4.1.1 on 2022-10-04 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_courses'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=255)),
                ('password', models.CharField(max_length=255)),
                ('e_mail', models.CharField(max_length=255)),
            ],
        ),
        migrations.AlterField(
            model_name='members',
            name='designation',
            field=models.CharField(default='Developer', max_length=255),
        ),
    ]
