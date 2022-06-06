let app = {};

let init = (app) => {

    // This is the Vue data.
    app.data = {
        add_mode: false,
        add_event_title: "",
        add_event_image: "",
        add_event_location: "",
        add_event_description: "",
        add_event_attachment: "",
        add_event_creator: "",
        add_event_pending_list: [],
        rows: [],
    };
    
    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.add_event = function () {
        axios.post(add_event_url,
            {
                event_title: app.vue.add_event_title,
                event_image: app.vue.add_event_image,
                event_location: app.vue.add_event_location,
                event_description: app.vue.add_event_description,
                event_attachment: app.vue.add_event_attachment,
                event_pending_list: app.vue.add_event_pending_list,
            }).then(function (response) {
            app.vue.rows.push({
                id: response.data.id,
                event_title: app.vue.add_event_title,
                event_image: app.vue.add_event_image,
                event_location: app.vue.add_event_location,
                event_description: app.vue.add_event_description,
                event_attachment: app.vue.add_event_attachment,
                event_pending_list: app.vue.add_event_pending_list,
            });
            app.enumerate(app.vue.rows);
            app.reset_form();
            app.set_add_status(false);
        });
    };

    app.reset_form = function () {
        app.vue.add_event_title = "";
        app.vue.add_event_image = "";
        app.vue.add_event_location = "";
        app.vue.add_event_description = "";
        app.vue.add_event_attachment = "";
        app.vue.add_event_pending_list = [];
    };

    app.delete_event = function(row_idx) {
        let id = app.vue.rows[row_idx].id;
        axios.get(delete_event_url, {params: {id: id}}).then(function (response) {
            for (let i = 0; i < app.vue.rows.length; i++) {
                if (app.vue.rows[i].id === id) {
                    app.vue.rows.splice(i, 1);
                    app.enumerate(app.vue.rows);
                    break;
                }
            }
            });
    };

    app.set_add_status = function (new_status) {
        app.vue.add_mode = new_status;
    };

    app.add_pending_list = function (e) {
        
    };
    
    app.methods = {
        add_event: app.add_event,
        set_add_status: app.set_add_status,
        delete_event: app.delete_event,
        add_pending_list: app.add_pending_list,
    };

    app.vue  = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
    });

    app.init = () => {
        axios.get(load_events_url).then(function (response) {
            app.vue.rows = app.enumerate(response.data.rows);
        });
    };

    app.init();
};

init(app);