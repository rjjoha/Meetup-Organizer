// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        add_mode: false,
        add_body: "",
        add_title: "",
        announcements: [],
        is_creator: false,
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.add_post = function(){
        axios.post(add_announcement_url,
            {
                body: app.vue.add_body,
                title: app.vue.add_title,
                id: event_id
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

    app.set_is_creator = function(){
        if(creator == username){
            is_creator = true;
        }else{
            is_creator = false;
        }

    }

    // This contains all the methods.
    app.methods = {
        set_is_creator: app.set_is_creator,
        delete_post: app.delete_post,
        add_post: app.add_post,
        set_add_status: app.set_add_status,
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
        axios.get(load_announcements_url, {params: {"id": event_id}})
            .then((result) => {
                let announcements = result.data.rows;
                app.enumerate(announcements);
                //app.complete(announcements);
                app.vue.announcements = announcements;
            });

    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);