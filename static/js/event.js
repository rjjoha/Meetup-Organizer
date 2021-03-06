// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        add_mode: false,
        change_mode: true,
        add_body: "",
        add_title: "",
        announcements: [],
        events_list: [],
        is_creator: false,
        current_id: -1,
        event_id: "",
        icon: "",
        
        user_email: user_email,
        messages: [],
        currentpost: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.add_post = function(row_idx){
        let id = app.vue.events_list[app.vue.current_id].event_id;
        console.log(id)
        axios.post(add_announcement_url,
            {
                body: app.vue.add_body,
                title: app.vue.add_title,
                id: id,
            }).then(function (response) {
                app.vue.announcements.push({
                    id: response.data.id,
                    body: app.vue.add_body,
                    title: app.vue.add_title,
                    author: response.data.name
                });
                app.enumerate(app.vue.announcements);
                app.reset_form();
                app.set_add_status(false);
            });
    };

    app.delete_post = function(row_idx){
        let id = app.vue.announcements[row_idx].id;
        axios.get(delete_announcement_url, {params: {id: id}}).then(function (response) {
            for (let i = 0; i < app.vue.announcements.length; i++) {
                if (app.vue.announcements[i].id === id) {
                    app.vue.announcements.splice(i, 1);
                    app.enumerate(app.vue.announcements);
                    break;
                }
            }
            });
    };

    app.reset_form = function(){
        app.vue.add_title = "";
        app.vue.add_body = "";
    }

    app.set_add_status = function(status){
        app.vue.add_mode = status;
    };

    app.set_change_status = function(status){
        app.vue.change_mode = status;
    };

    app.set_is_creator = function(){
        let event = app.vue.events_list[app.vue.current_id];
        if(event.event_creator == username){
            app.vue.is_creator = true;
        }else{
            app.vue.is_creator = false;
        }

    }

    app.load_event = function(row_idx){
        let event = app.vue.events_list[row_idx];
        app.vue.icon = "";
        axios.post(obtain_gcs, {
            action: "GET",
            file_path: event.event_icon
        }).then((result) => {
            app.vue.icon = result.data.signed_url;
        });
        app.vue.change_mode = false;
        app.vue.title = event.event_title;
        app.vue.description = event.event_description;
        app.vue.location = event.event_location;
        app.vue.date = event.event_date;
        app.vue.current_id = row_idx;
        app.vue.event_id =  event.event_id;
        app.vue.set_is_creator();
        axios.get(load_announcements_url, {params: {"id": event.event_id}})
            .then((result) => {
                let announcements = result.data.rows;
                app.enumerate(announcements);
                //app.complete(announcements);
                app.vue.announcements = announcements;
            })
    };

    app.add_message = function() { 
        axios.post(add_message_url, {
            post_message: app.vue.currentpost
        }).then(function (response) {
            app.vue.messages.unshift({
                id: response.data.id,
                post_message: app.vue.currentpost,
                entered_name: usern,
                user_email: user_email,
            });
            app.enumerate(app.vue.messages);
            app.clear_message();
        });
    };

    app.clear_message = function() {
        app.vue.currentpost = '';
    };

    // app.delete_message = function(post_idx) {
    //     let p = app.vue.messages[post_idx];
    //     axios.post(delete_message_url, {id: p.id}).then(() => {
    //         app.vue.messages.splice(post_idx, 1);
    //         app.enumerate(app.vue.messages);
    //     });
    // };
    
    app.delete_message = function(row_idx){
        let id = app.vue.messages[row_idx].id;
        axios.get(delete_message_url, {params: {id: id}}).then(function (response) {
            for (let i = 0; i < app.vue.messages.length; i++) {
                if (app.vue.messages[i].id === id) {
                    app.vue.messages.splice(i, 1);
                    app.enumerate(app.vue.messages);
                    break;
                }
            }
            });
    };


    // This contains all the methods.
    app.methods = {
        load_event: app.load_event,
        set_is_creator: app.set_is_creator,
        delete_post: app.delete_post,
        add_post: app.add_post,
        set_add_status: app.set_add_status,
        set_change_status: app.set_change_status,
        
        add_message: app.add_message,
        clear_message: app.clear_message,
        delete_message: app.delete_message,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
        axios.get(load_user_events_url).then((result) => {
            let events_list = result.data.events;
            console.log(result.data.events);
            app.enumerate(events_list);
            app.vue.events_list = events_list;
        });
        axios.get(get_messages_url)
        .then((result) => {
            // We set them
            let messages = result.data.messages;
            app.enumerate(messages);
            app.vue.messages = messages;
        })

    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);