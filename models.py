"""
This file defines the database models
"""

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
    Field('event_attachment', 'upload'),
    Field('user_email', default=get_user_email),
    Field('pending_invite', 'boolean', default=FALSE),
)

db.define_table(
    'profile',
    Field('prof_first_name', requires=IS_NOT_EMPTY()),
    Field('prof_last_name', requires=IS_NOT_EMPTY()),
    Field('description'),
    Field('notifications' 'reference events'),
    Field('events', 'reference event'),

db.define_table(
    'invite',
    Field('invite_first_name', requires=IS_NOT_EMPTY()),
    Field('invite_last_name', requires=IS_NOT_EMPTY()),
    Field('invited', 'reference profile_id'),
    Field('invited_event_id', 'reference event'),
)


)

db.event.id.readable = db.event.id.writable = False
db.event.user_email.readable = db.event.user_email.writable = False

db.commit()