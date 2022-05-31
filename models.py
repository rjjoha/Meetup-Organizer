"""
This file defines the database models
"""

import datetime
from pickle import FALSE
from .common import db, Field, auth
from pydal.validators import *

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()
    
### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later
#
# db.commit()
#

db.define_table(
    'event',
    Field('event_title', requires=IS_NOT_EMPTY()),
    Field('event_image', 'upload'),
    Field('event_location', requires=IS_NOT_EMPTY()),
    Field('event_description', requires=IS_NOT_EMPTY()),
    Field('event_date', 'date'),
    Field('event_attachment', 'upload'),
    Field('invite_users'),
    Field('event_creator', default=get_user_email),
    # Field('pending_invite', 'list:reference profile'),
    # Field('accepted_invite', 'list:reference profile'),
)

db.define_table(
    'profile',
    Field('profile_first_name', requires=IS_NOT_EMPTY()),
    Field('profile_last_name', requires=IS_NOT_EMPTY()),
    Field('profile_image', 'upload'),
    Field('profile_hobbies'),
    Field('profile_location'),
    Field('description'),
    Field('user_email', default=get_user_email),
    Field('notification'),
    # Field('notifications', 'list:reference event'), ## Pending invites
    # Field('events', 'list:reference event'), ## Accepted invites


)

db.define_table(
    'invite',
    Field('event_invited', 'reference event'),
    Field('inviter', default=get_user_email),
    Field('invitee') #email
)

db.define_table(
    'notifications',
    Field('All'),
    Field('Pending'),
    Field('Accepted')
)
db.event.id.readable = db.event.id.writable = False
db.profile.id.readable = db.profile.id.writable = False
db.event.user_email.readable = db.event.user_email.writable = False
db.profile.user_email.readable = db.profile.user_email.writable = False

db.commit()