// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        show_accepted: false,
        
        show_all: false,
        rows: [],
        tab: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
    app.acceptInit = posts => {
        posts.map((post) => {
            post.accepted = false; 

        })
    }
    app.addAccept = function (idx){
        let post = app.vue.rows[idx]
        post.accepted = true 
        axios.post(set_accepted_url, {

            eventid : post.id
        });
    };

    app.set_accepted = function (b){
       
    };
    
    app.set_tab = function (new_tab) {
        app.vue.tab = new_tab;
    };
    
    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        set_accepted: app.set_accepted,
        set_tab: app.set_tab,
        addAccept: app.addAccept,
        
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
      
    });

    // And this initializes it.
    app.init = () => {
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
        // this would be replaced the events invited
        
        axios.get(all_url).then(function (response) {
            app.vue.rows = app.enumerate(response.data.rows);
            let posts = response.data.rows; 
            app.acceptInit(posts);
            
        })
        .then(() => {
            for(let row of app.vue.rows){
                axios.get(get_accepted_url, {params: {eventid: row.id}}).then ((response) => {
                    row.accepted = response.data.accepted; 
                });
            }
        });
        
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);

