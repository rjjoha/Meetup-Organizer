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
        add_event_image: null,
        add_event_location: "",
        add_event_description: "",
        add_event_attachment: "",
        add_event_creator: "",
        add_event_pending_list: [],
        add_user: "",
        rows: [],

        // initializing invitee
        invitee :  "",

        add_first_name: "",
        add_last_name: "",
        add_image: "",
        add_hobbies: "",
        add_location: "",
        add_description: "",
        profile_rows: [],
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
            app.vue.add_event_image = app.image;
            app.vue.image_selection_done = true;
            // We read the image.
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                app.vue.image_url = reader.result;
            });
            reader.readAsDataURL(app.image);
        }
    };

    app.upload_image = function () {
        const file = app.image;
        if (file) {
            app.vue.uploading_image = true;
            let file_type = file.type;
            let file_name = file.name;
            let file_size = file.size;
            // Requests the upload URL.
            axios.post(obtain_gcs, {
                action: "PUT",
                mimetype: file_type,
                file_name: file_name
            }).then ((r) => {
                let upload_url = r.data.signed_url;
                let file_path = r.data.file_path;
                // Uploads the file, using the low-level interface.
                let req = new XMLHttpRequest();
                // We listen to the load event = the file is uploaded, and we call upload_complete.
                // That function will notify the server `of the location of the image.
                req.addEventListener("load", function () {
                    app.upload_complete(file_name, file_type, file_size, file_path);
                });
                // TODO: if you like, add a listener for "error" to detect failure.
                req.open("PUT", upload_url, true);
                req.send(file);
            });
        }
    }

    app.upload_complete = function (file_name, file_type, file_size, file_path) {
        app.vue.uploading_image = false;
        app.vue.uploaded1 = true;
        app.vue.uploaded_image = file_path;
    }
    
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
        const file = app.attachment1;
        if (file) {
            app.vue.uploading_attachment = true;
            let file_type = file.type;
            let file_name = file.name;
            let file_size = file.size;
            // Requests the upload URL.
            axios.post(obtain_gcs, {
                action: "PUT",
                mimetype: file_type,
                file_name: file_name
            }).then ((r) => {
                let upload_url = r.data.signed_url;
                let file_path = r.data.file_path;
                // Uploads the file, using the low-level interface.
                let req = new XMLHttpRequest();
                // We listen to the load event = the file is uploaded, and we call upload_complete.
                // That function will notify the server `of the location of the image.
                req.addEventListener("load", function () {
                    app.upload_attachment_complete(file_name, file_type, file_size, file_path);
                });
                // TODO: if you like, add a listener for "error" to detect failure.
                req.open("PUT", upload_url, true);
                req.send(file);
            });
        }
    };

    app.upload_attachment_complete = function (file_name, file_type, file_size, file_path) {
        app.vue.uploading_attachment = false;
        app.vue.uploaded2 = true;
        app.vue.uploaded_attachment = file_path;
    }

    app.add_event = function () {
        axios.post(add_event_url, 
            {
                event_title: app.vue.add_event_title,
                event_location: app.vue.add_event_location,
                event_image: app.vue.uploaded_image,
                event_description: app.vue.add_event_description,
                event_attachment: app.vue.uploaded_attachment,
                event_pending_list: app.vue.add_event_pending_list,
                invitee :  app.vue.invitee,
            }
            ).then(function (response) {
            app.vue.rows.push({
                id: response.data.id,
                event_title: app.vue.add_event_title,
                event_image: app.vue.uploaded_image,
                event_location: app.vue.add_event_location,
                event_description: app.vue.add_event_description,
                event_attachment: app.vue.uploaded_attachment,
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

        app.vue.add_first_name = "";
        app.vue.add_last_name = "";
        app.vue.add_image = "";
        app.vue.add_hobbies = "";
        app.vue.add_location = "";
        app.vue.add_description = "";
    };

    app.add_profile = function () {
        axios.post(account_settings_url, {
                profile_first_name: app.vue.add_first_name,
                profile_last_name: app.vue.add_last_name,
                profile_image: app.vue.add_image,
                profile_hobbies: app.vue.add_hobbies,
                profile_location: app.vue.add_location,
                profile_description: app.vue.add_description,
            });
            app.enumerate(app.vue.profile_rows);
            app.reset_form();
            app.set_add_status(false);
        
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

        add_profile: app.add_profile,
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
        axios.get(load_profile_url).then(function (response) {
            app.vue.profile_rows.push(response.data.rows);
        })
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
