// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // event image attributes
        image_selection_done: false,
        uploading_image: false,
        uploaded_image: "",
        uploaded1: false,
        image_url: "",
        
        // event attachment attributes
        attachment_selection_done: false,
        uploading_attachment: false,
        uploaded_attachment: "",
        uploaded2: false,
        attachment_url: "",
        
        add_mode: false,
        add_event_title: "",
        add_event_image: "",
        add_event_location: "",
        add_event_description: "",
        add_event_attachment: "",
        add_event_creator: "",
        add_event_pending_list: [],
        add_user: "",
        rows: [],

        // initializing invitee
        invitee :  "",
    };
    
    app.image = null;
    app.attachment1 = null;

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
    
    // selecting and uploading image
    app.select_image = function (event) {
        // Reads the image.
        let input1 = event.target;
        app.image = input1.files[0];
        if (app.image) {
            app.vue.image_selection_done = true;
            // We read the image.
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                app.vue.image_url = reader.result;
            });
            reader.readAsDataURL(app.image);
        }
    };

    app.upload_image_complete = function (image_name, image_type) {
        app.vue.uploading_image = false;
        app.vue.uploaded1 = true;
    };

    app.upload_image = function () {
        if (app.image) {
            let image_type = app.image.type;
            let image_name = app.image.name;
            let full_image_url = image_upload_url + "&image_name=" + encodeURIComponent(image_name)
                + "&image_type=" + encodeURIComponent(image_type);
            // Uploads the image, using the low-level streaming interface. This avoid any
            // encoding.
            app.vue.uploading_image = true;
            let req = new XMLHttpRequest();
            req.addEventListener("load", function () {
                app.upload_image_complete(image_name, image_type)
            });
            req.open("PUT", full_image_url, true);
            req.send(app.image);
        }
    };
    
    // selecting and uploading attachment
    app.select_attachment = function (event) {
        // Reads the attachment.
        let input2 = event.target;
        app.attachment1 = input2.files[0];
        if (app.attachment1) {
            app.vue.attachment_selection_done = true;
            // We read the attachment.
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                app.vue.attachment_url = reader.result;
            });
            reader.readAsDataURL(app.attachment1);
        }
    };

    app.upload_attachment_complete = function (attachment_name, attachment_type) {
        app.vue.uploading_attachment = false;
        app.vue.uploaded2 = true;
    };

    app.upload_attachment = function () {
        if (app.attachment1) {
            let attachment_type = app.attachment1.type;
            let attachment_name = app.attachment1.name;
            let full_attachment_url = attachment_upload_url + "&attachment_name=" + encodeURIComponent(attachment_name)
                + "&attachment_type=" + encodeURIComponent(attachment_type);
            // Uploads the attachment, using the low-level streaming interface. This avoid any
            // encoding.
            app.vue.uploading_attachment = true;
            let req = new XMLHttpRequest();
            req.addEventListener("load", function () {
                app.upload_attachment_complete(attachment_name, attachment_type)
            });
            req.open("PUT", full_attachment_url, true);
            req.send(app.attachment1);
        }
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
                invitee :  app.vue.invitee,
            }).then(function (response) {
            app.vue.rows.push({
                id: response.data.id,
                event_title: app.vue.add_event_title,
                event_image: app.vue.add_event_image,
                event_location: app.vue.add_event_location,
                event_description: app.vue.add_event_description,
                event_attachment: app.vue.add_event_attachment,
                event_pending_list: app.vue.add_event_pending_list,
                invitee :  app.vue.invitee,
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
        if(e.key === ',' && this.add_user) {
            this.add_user = this.add_user.slice(0, -1)
            if(!this.add_event_pending_list.includes(this.add_user)) {
                this.add_event_pending_list.push(this.add_user);
            }
            this.add_user = "";
        }
    }

    // We form the dictionary of all methods, so we can assign them
    // to the Vue app in a single blow.
    app.methods = {
        select_image: app.select_image,
        upload_image: app.upload_image,
        
        select_attachment: app.select_attachment,
        upload_attachment: app.upload_attachment,
        
        add_event: app.add_event,
        set_add_status: app.set_add_status,
        delete_event: app.delete_event,
        add_pending_list: app.add_pending_list,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    // Generally, this will be a network call to the server to
    // load the data.
    // For the moment, we 'load' the data from a string.
    app.init = () => {
        axios.get(load_events_url).then(function (response) {
            app.vue.rows = app.enumerate(response.data.rows);
        });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
