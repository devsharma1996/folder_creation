# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-29 06:20
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0002_auto_20170722_1246'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='folder',
            name='folder_pointing',
        ),
        migrations.RemoveField(
            model_name='ekfile',
            name='folder',
        ),
        migrations.DeleteModel(
            name='Folder',
        ),
    ]
