# Generated by Django 3.2.5 on 2021-08-02 10:20

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0034_alter_chatmessage_sent_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmessage',
            name='sent_at',
            field=models.DateTimeField(default=datetime.datetime(2021, 8, 2, 13, 20, 30, 945624)),
        ),
    ]
