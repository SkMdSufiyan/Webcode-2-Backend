const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadName : {
        type : String,
        required : true,
        trim : true
    },
    leadEmail : {
        type : String,
        required : true,
        trim : true
    },
    leadAddress : {
        type : String,
        required : true,
        trim : true
    },
    addedBy : {
        type : String,
        required : true,
        trim : true
    },
    addedDate : {
        type : String,
        required : true,
        trim : true
    },
    leadStatus : {
        type : String,
        required : true,
        trim : true
    }
});

module.exports = mongoose.model("Leads", leadSchema);
