# Generated by Django 3.2.5 on 2021-08-01 15:31

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0016_alter_chatmessage_sent_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmessage',
            name='sent_at',
            field=models.DateTimeField(default=datetime.datetime(2021, 8, 1, 18, 31, 10, 84187)),
        ),
    ]
