// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        add_mode: false,
        add_first_name: "",
        add_last_name: "",
        add_image: "",
        add_hobbies: "",
        add_location: "",
        add_description: "",
        
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.set_add_status = function(status){
        app.vue.add_mode = status;
    };

    app.reset_form = function () {
        app.vue.add_first_name = "";
        app.vue.add_last_name = "";
        app.vue.add_image = "";
        app.vue.add_hobbies = "";
        app.vue.add_location = "";
        app.vue.add_description = "";
    };

    app.add_profile = function () {
        axios.post(add_profile_url, {
                profile_first_name: app.vue.add_first_name,
                profile_last_name: app.vue.add_last_name,
                profile_image: app.vue.add_image,
                profile_hobbies: app.vue.add_hobbies,
                profile_location: app.vue.add_location,
                profile_description: app.vue.add_description,
            });
            app.reset_form();
            app.set_add_status(false);
    };

    // This contains all the methods.
    app.methods = {
        set_add_status: app.set_add_status,
        add_profile: app.add_profile,
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
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);