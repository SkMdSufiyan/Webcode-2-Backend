const mongoose = require('mongoose');

const serviceRequestSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    createdBy : {
        type : String,
        required : true,
        trim : true
    },
    createdDate : {
        type : String,
        required: true,
        trim : true
    },
    status : {
        type : String,
        required : true,
        trim : true
    }
});

module.exports = mongoose.model("ServiceRequests", serviceRequestSchema);