"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL, Field
from py4web.utils.form import Form, FormStyleBulma
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash

##############Leejin Kim##############
from .models import get_user_email
from .settings import APP_FOLDER
from py4web.utils.url_signer import URLSigner
import os
url_signer = URLSigner(session)
import json
#############    end    ##############

@action("index")
@action.uses("index.html", auth, url_signer, db, session, T)
def index():
    user = auth.get_user()
    message = T("Hello {first_name}".format(**user) if user else "Hello")
    actions = {"allowed_actions": auth.param.allowed_actions}
    return dict(account_settings_url = URL('account_settings', signer=url_signer),
                load_profile_url = URL('load_profile', signer=url_signer), 
                load_events_url = URL('load_events', signer=url_signer), 
                image_upload_url = URL('image_upload', signer=url_signer),
                attachment_upload_url = URL('attachment_upload', signer=url_signer),
                add_event_url = URL('add_event', signer=url_signer),
                delete_event_url = URL('delete_event', signer=url_signer),
                message=message, actions=actions, url_signer=url_signer)

@action('create_event')
@action.uses('create_event.html', url_signer, auth.user, db)
def create_event():
    return dict(
        image_upload_url = URL('image_upload', signer=url_signer),
        attachment_upload_url = URL('attachment_upload', signer=url_signer),
        load_events_url = URL('load_events', signer=url_signer),
        add_event_url = URL('add_event', signer=url_signer),
        delete_event_url = URL('delete_event', signer=url_signer),
    )

@action('load_events')
@action.uses(url_signer.verify(), db)
def load_events():
    # rows = db(db.invite.invitee == get_user_email()).select().as_list()
    rows = db(db.event).select().as_list()
    return dict(rows=rows)
    
@action('add_event', method="POST")
@action.uses(url_signer.verify(), db)
def add_event():
    id = db.event.insert(
        event_title=request.json.get('event_title'),
        event_image=request.json.get('event_image'),
        event_location=request.json.get('event_location'),
        event_description=request.json.get('event_description'),
        event_attachment=request.json.get('event_attachment'),
        event_creator=get_user_email(),
    )
    mylist = request.json.get('event_pending_list'),
    # print(mylist)
    extractlist = []
    for things in mylist[0]:
        extractlist.append(things)
   
    for names in extractlist:
        db.pending.insert(
            pending_inviter=get_user_email(),
            pending_invitee=names,
            event_pending=id,
        )
        # print(names)
    rows = db(db.pending.pending_invitee).select().as_list()
    # for row in rows:
    #     print(row)
    # for names in extractlist:
    #     if id.event_creator != names: 
    #         db.invite.insert(
    #                 event_invited = id,
    #                 inviter = get_user_email(),
    #                 invitee = request.json.get('invitee'),
                    
    #         )
    db.invite.insert(
        event_invited = id,
        inviter = get_user_email(),
        invitee = get_user_email(),
    )
    return dict(id=id)


# @action('add', method=["GET", "POST"])
# @action.uses(url_signer, db, session, auth.user)
# def add():
#     # Insert form: no record= in it.
#     form = Form(db.event, csrf_session=session, formstyle=FormStyleBulma)
#     if form.accepted:
#         # We simply redirect; the insertion already happened.
#         redirect(URL('index'))
#     # Either this is a GET request, or this is a POST but not accepted = with errors.
#     return dict(form=form)

# @action('edit_event/<event_id:int>', method=["GET", "POST"])
# @action.uses('edit_event.html', url_signer, db, session, auth.user)
# def edit(event_id=None):
#     assert event_id is not None
#     e = db.event[event_id]
#     if e is None:
#         # Nothing found to be edited!
#         redirect(URL('index'))
#     # Edit form: it has record=
#     form = Form(db.event, record=b, deletable=False, csrf_session=session, formstyle=FormStyleBulma)
#     if form.accepted:
#         # The update already happened!
#         redirect(URL('index'))
#     return dict(form=form)

@action('delete_event')
@action.uses(url_signer.verify(), db)
def delete_event():
    id = request.params.get('id')
    assert id is not None
    db(db.event.id == id).delete()

##############Leejin Kim##############

# @action('notifications/<event_id:int>', method=["GET", "POST"])
# @action.uses('notifications.html', url_signer, db, session, auth.user)
# def notifications(event_id=None):
#     assert event_id is not None
#     # user = auth.get_user()
#     p = db.event[event_id]
#     if p["user_email"] != get_user_email():
#         redirect(URL('index'))
#     if p is None:

#         redirect(URL('index'))
#     # s is the user_name
#     s = ""
#     # s = user


#     return dict( s = s)

# @action("notifications")
# @action.uses("notifications.html", auth, T)
# def index():
#     user = auth.get_user()
#     rows = db(db.event.user_email == get_user_email()).select()
#     s = user
#     return dict(rows=rows, url_signer=url_signer, s = s)
@action('notifications')
@action.uses('notifications.html', url_signer, auth.user, db)
def notifications():
   
        # COMPLETE: return here any signed URLs you need.
        user = auth.get_user()
        rows = db(db.event.event_creator == get_user_email()).select()
        s = user
        return dict(
            all_url = URL('all', signer=url_signer),
            set_accepted_url = URL('set_accepted', signer=url_signer),
            get_accepted_url = URL('accepted', signer=url_signer),
            
            rows=rows, url_signer=url_signer, s = s)
    

@action('set_accepted', method='POST')
@action.uses(db, auth.user, url_signer.verify())
def set_accepted():
    eventid = request.json.get('eventid')
    creator = db(db.event.id == eventid).select().first().event_creator

    db.invite.update_or_insert(event_invited = eventid, invitee = get_user_email(), inviter=creator)
    #eventid = request.json.get('eventid')
    #row = db((db.invite.event_invited == eventid) ).select().as_list()
    #email = get_user_email()
    #for r in row:
        #if r['invitee'] ==  "": 
            # print("this is invitee", r)
           # db((db.invite.id == r['id']) ).update(
                 #invitee = email

           # )
           #break
            # r.update_record()
   
    # if row.invitee is not None:
    #     print(row)
    #     if (email != row.invitee ):
    #         # row.invitee.append(email)
    #         row.invitee  = email
    #         row.update_record()
            
    #         # db((db.invite.event_invited == eventid) ).update(
    #         #     invitee = row.invitee 

    #         # )
       
    # else: 
    #     row.invitee  = email
        
    #     row.update_record()

   
    return "ok"

@action('accepted')
@action.uses(url_signer.verify(), db, auth.user)
def accepted():
    eventid = request.params.get('eventid') 
    row = db((db.invite.event_invited == eventid) ).select().as_list()
    email = get_user_email() 
    accepted = False 
    for r in row:
        if r['invitee'] != "": 
            # print("this is invitee", r)
            if (email in r['invitee'] ):
                accepted = True
    
    # if row.invitee is not None:
    #     print("this is invie", row.invitee)
    #     if (email == row.invitee ):
    #         accepted = True

    return dict(accepted = accepted)
# load the list of pending list 
@action('all')
@action.uses(url_signer.verify(), db)
def all():
    rows = db(db.event).select().as_list()
    pending = []
    email = get_user_email() 
    row = db(db.pending.event_pending).select().as_list()
    # print(email)
    # for r in rows: 
    # #     print(r['id'])
    # #     row =  db((db.pending.event_pending == r['id']) ).select().first()
    for r in row : 
        
        if r is not None: 
            event = db((db.event.id == r['event_pending']) ).select().first()
            
            if(email in r['pending_invitee'] and event.event_creator != email ):
                
                pending.append(event)
    

    # print(pending)       
    return dict(rows=pending)
    
#############    end    ##############

#############Robert Johansen###############
@action("splash_page")
@action.uses("splash_page.html", auth, db, session, T)
def splash_page():
    return dict()

@action('account_settings', method="POST")
@action.uses(url_signer.verify(), db, session)
def account_settings():
    # form = Form(db.profile, deletable=False, csrf_session=session, formstyle=FormStyleBulma)
    # if form.accepted:
    #     redirect(URL('index'))
    id = db.profile.update_or_insert((db.profile.user_email == get_user_email()),
                        profile_first_name = request.json.get("profile_first_name"),
                        profile_last_name = request.json.get("profile_last_name"),
                        profile_image = request.json.get("profile_image"),
                        profile_hobbies = request.json.get("profile_hobbies"),
                        profile_location = request.json.get("profile_location"),
                        profile_description = request.json.get("profile_description"),)
    return dict(id=id)

@action('load_profile')
@action.uses(url_signer.verify(), db)
def load_events():
    rows = db(db.profile.user_email == get_user_email()).select().first()
    if rows is None:
        db.profile.insert(
            profile_first_name='New',
            profile_last_name='User',
            profile_hobbies='Change',
            profile_location='Profile',
            profile_description='Settings',
            user_email=get_user_email())
    rows = db(db.profile.user_email == get_user_email()).select().first()     
    return dict(rows=rows)

#############    end    ##############

#############Michael Ekman###############
@action("event")
@action.uses(url_signer, "event.html", db, auth)
def event():
    return dict(
                username=get_user_email(),
                load_user_events_url = URL('load_user_events', signer=url_signer),
                load_announcements_url = URL('load_announcements', signer=url_signer),
                add_announcement_url = URL('add_announcement', signer=url_signer),
                load_event_details_url = URL('load_event_details', signer=url_signer),
                delete_announcement_url = URL('delete_announcement', signer=url_signer),
                
                get_messages_url = URL('get_messages', signer=url_signer),
                add_message_url = URL('add_message', signer=url_signer),
                delete_message_url= URL('delete_message', signer=url_signer),
                user_email = get_user_email(),
                usern =  auth.current_user.get('first_name') + " " + auth.current_user.get("last_name"),
        
                url_signer=url_signer,
                )

@action("load_announcements")
@action.uses(url_signer.verify(), db, auth.user)
def load_annoucements():
    id = request.params.get('id')
    rows = db(db.announcement.event == id).select().as_list()
    return dict(rows=rows)

@action("add_announcement", method="POST")
@action.uses(url_signer.verify(), db, auth.user)
def add_announcement():
    id = db.announcement.insert(
        body=request.json.get('body'),
        title=request.json.get('title'),
        event=request.json.get('id')
    )
    return dict(id=id)

@action('delete_announcement')
@action.uses(url_signer.verify(), db,auth.user)
def delete_announcement():
    id = request.params.get('id')
    assert id is not None
    a = db(db.announcement.id == id).select().first()
    event_id = a.event
    creator = db(db.event.id == event_id).select().first().event_creator
    if(creator == get_user_email()):
        db(db.announcement.id == id).delete()
        return "ok"
    return "Failed"


@action('get_messages')
@action.uses(url_signer.verify(), auth.user)
def get_messages():
    messages = db(db.post).select().as_list()
    for post in messages:
        r = db(db.auth_user.email == post['user_email']).select().first()
        name = r.first_name + " " + r.last_name if r is not None else "Unknown"
        post["entered_name"] = name
    messages.reverse() 
    return dict(messages=messages)

@action('add_message', method="POST")
@action.uses(url_signer.verify(), auth.user, db)
def add_message():
    id = db.post.insert(
        post_message = request.json.get('post_message')
    )
    return dict(id=id)

@action('delete_message')
@action.uses(url_signer.verify(), db, auth.user)
def delete_message():
    id = request.params.get('id')
    assert id is not None
    db(db.post.id == id).delete()
    return "ok"


@action("edit_event")
@action.uses(url_signer.verify(), "edit_event.html", db, auth)
def edit_event():
    event = db(db.invite.invitee == get_user_email()).select().first()
    event = event.event_invited

    id = event.id
    creator = event.event_creator

    return dict(id=id,
                creator=creator,
                update_event_url = URL('update_event', signer=url_signer),
                load_event_details_url = URL('load_event_details', signer=url_signer),
                kick_member_url = URL('kick_member', signer=url_signer),
                delete_event_url = URL('delete_event', signer=url_signer),
                )
                
@action("load_event_details")
@action.uses(url_signer.verify(), db, auth)
def load_event_details():
    event = db(db.invite.invitee == get_user_email()).select().first()
    event = event.event_invited
    title = event.event_title
    icon = event.event_image
    location = event.event_location
    date = event.event_date
    attachment = event.event_attachment
    description = event.event_description
    id = event.id
    creator = event.event_creator

    members = db(db.invite.event_invited == id).select().as_list()
    return dict(title=title,
                icon=icon,
                location=location,
                date=date,
                attachment=attachment,
                description=description,
                id=id,
                creator=creator,
                members=members,
                )

@action("update_event", method="POST")
@action.uses(url_signer.verify(), db, auth)
def update_event():
    id = request.params.get('id')
    event = db(db.event.id == id)
    creator = event.select().first().event_creator
    if(creator == get_user_email()):
        event.update(
            event_description=request.json.get('description'),
            event_title=request.json.get('title'),
            event_location=request.json.get('location'),
            event_date=request.json.get('date'),
        )
        return "ok"
    return "failed"

@action("kick_member")
@action.uses(url_signer.verify(), db, auth)
def kick_member():
    id = request.params.get('id')
    assert id is not None
    invite = db(db.invite.id == id).select().first()
    if(invite.inviter == get_user_email()):
        db(db.invite.id == id).delete()
        return "ok"
    return "Failed"

@action("load_user_events")
@action.uses(url_signer.verify(), db,auth)
def load_user_events():
    invites = db(db.invite.invitee == get_user_email()).select().as_list()
    events = []
    for i in invites:
        event = db(db.event.id == i['event_invited']).select().first()
        events.append({
            "event_id": event.id,
            "event_title": event.event_title,
            "event_location": event.event_location,
            "event_description": event.event_description,
            "event_creator": event.event_creator,
        })
    return dict(events=events)