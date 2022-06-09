// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        set_description: false,
        change_mode: true,
        set_title: false,
        set_date: false,
        set_location: false,
        set_attachment: false,
        set_icon: false,

        add_description: "",
        add_title: "",
        add_date: "",
        add_location: "",
        members: [],
        events_list: [],
        event_id: -1,
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.set_title_status = function(status){
        app.vue.set_title = status;
        app.vue.set_date = false;
        app.vue.set_description = false;
        app.vue.set_location = false;
        app.vue.set_attachment = false;
        app.vue.set_icon = false;
    };

    app.set_date_status = function(status){
        app.vue.set_title = false;
        app.vue.set_date = status;
        app.vue.set_description = false;
        app.vue.set_location = false;
        app.vue.set_attachment = false;
        app.vue.set_icon = false;
    };

    app.set_description_status = function(status){
        app.vue.set_title = false;
        app.vue.set_date = false;
        app.vue.set_description = status;
        app.vue.set_location = false;
        app.vue.set_attachment = false;
        app.vue.set_icon = false;
    };

    app.set_location_status = function(status){
        app.vue.set_title = false;
        app.vue.set_date = false;
        app.vue.set_description = false;
        app.vue.set_location = status;
        app.vue.set_attachment = false;
        app.vue.set_icon = false;
    };

    app.set_attachment_status = function(status){
        app.vue.set_title = false;
        app.vue.set_date = false;
        app.vue.set_description = false;
        app.vue.set_location = false;
        app.vue.set_attachment = status;
        app.vue.set_icon = false;
    };

    app.set_icon_status = function(status){
        app.vue.set_title = false;
        app.vue.set_date = false;
        app.vue.set_description = false;
        app.vue.set_location = false;
        app.vue.set_attachment = false;
        app.vue.set_icon = status;
    };

    app.update_event = function(){
        axios.post(update_event_url, 
            {
                title: app.vue.add_title,
                location: app.vue.add_location,
                date: app.vue.add_date,
                description: app.vue.add_description,
                id: app.vue.event_id
            });
    };

    app.kick_member = function(row_idx){
        let id = app.vue.members[row_idx].id;
        axios.get(kick_member_url, {params: {id: id}}).then(function (response) {
            for (let i = 0; i < app.vue.members.length; i++) {
                if (app.vue.members[i].id === id) {
                    app.vue.members.splice(i, 1);
                    app.enumerate(app.vue.members);
                    break;
                }
            }
            });
    };

    app.delete_event = function(){
        axios.get(delete_event_url, {params: {id: event_id}});
    };

    app.set_change_status = function(status){
        app.vue.change_mode = status;
    };

    app.load_event = function(row_idx){
        let event = app.vue.events_list[row_idx];
        app.vue.change_mode = false;
        app.vue.add_title = event.event_title;
        app.vue.add_description = event.event_description;
        app.vue.add_location = event.event_location;
        app.vue.add_date = event.event_date;
        app.vue.add_current_id = row_idx;
        app.vue.event_id = event.id;

        axios.get(load_event_details_url, {params: {id: event.id}}).then((result) => {
            let members = result.data.members;
            app.enumerate(members);
            app.vue.members = members;
        });
    };

    // This contains all the methods.
    app.methods = {
        load_event: app.load_event,
        delete_event: app.delete_event,
        set_change_status: app.set_change_status,
        kick_member: app.kick_member,
        update_event: app.update_event,
        set_title_status: app.set_title_status,
        set_date_status: app.set_date_status,
        set_description_status:  app.set_description_status,
        set_location_status: app.set_location_status,
        set_attachment_status: app.set_attachment_status,
        set_icon_status: app.set_icon_status,
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
        axios.get(load_creator_events_url).then((result) => {
            let events_list = result.data.events;
            app.enumerate(events_list);
            app.vue.events_list = events_list;
        });
        
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);