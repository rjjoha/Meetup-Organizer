"""
This file defines the database models
"""

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
    Field('event_image', "upload"),
    Field('event_location', requires=IS_NOT_EMPTY()),
    Field('event_description', requires=IS_NOT_EMPTY()),
    Field('event_attachment', "upload"),
    Field('user_email', default=get_user_email)
)

db.event.id.readable = db.event.id.writable = False
db.event.user_email.readable = db.event.user_email.writable = False

db.commit()