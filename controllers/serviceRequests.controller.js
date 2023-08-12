const serviceRequestsModel = require('../models/serviceRequests.model.js');
const usersModel = require('../models/users.model.js');
const {emailSendingFunction} = require('./emailSender.js');

exports.getAllServiceRequests = async (req, res) => {
    try{
        await serviceRequestsModel.find()
        .then(documents => {
            res.status(200).send({message : "All the service requests data is obtained successfully", data : documents});
        })
        .catch(err => {
            res.status(400).send({message : "Failed to obtain service requests data", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.getSingleServiceRequestByID = async (req, res) => {
    try{
        const serviceRequestID = req.params.serviceRequestID;

        await serviceRequestsModel.findOne({_id : serviceRequestID})
        .then (result => {
            if(result){
                res.status(200).send({message : "Service request data is obtained successfully", data : result});
            }else{
                res.status(400).send({message : "Service request not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to obtain service request data", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.addServiceRequest = async (req, res) => {
    try{
        const payload = req.body;

        const newServiceRequest = new serviceRequestsModel(payload);

        const adminsOrManagersEmailIDs = await usersModel.find({typeOfUser : {$in : ["Admin", "Manager"] }}, {_id : 0, email : 1});

        await newServiceRequest.save()
        .then(result => {

            const emailSubject = "A new service request is added in the CRM app.";
            const emailMessage = `A new service request with _id ${result._id} is added.`;
            const successfullyTriggeredEmailTo = [];

            if(adminsOrManagersEmailIDs.length > 0){
                adminsOrManagersEmailIDs.map(val => {
                    const emailSent = emailSendingFunction(val.email, emailSubject, emailMessage);
                    if(emailSent){
                        successfullyTriggeredEmailTo.push(val.email);
                    }
                });
            }
            
            res.status(200).send({message : "Service request is added successfully", _id : result._id, successfullyTriggeredEmailTo : successfullyTriggeredEmailTo});
        })
        .catch(err => {
            res.status(400).send({message : "Failed to add the service request", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.updateServiceRequest = async (req, res) => {
    try{
        const serviceRequestID = req.params.serviceRequestID;
        const payload = req.body;

        await serviceRequestsModel.findOneAndUpdate({_id : serviceRequestID}, {$set : payload})
        .then(result => {
            if(result){
                res.status(200).send({message : "Service request is updated successfully"});
            }else{
                res.status(400).send({message : "Service request not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to update service request", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.deleteServiceRequest = async (req, res) => {
    try{
        const serviceRequestID = req.params.serviceRequestID;

        await serviceRequestsModel.findOneAndDelete({_id : serviceRequestID})
        .then(result => {
            if(result){
                res.status(200).send({message : "Service request is deleted successfully"});
            }else{
                res.status(400).send({message : "Service request not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to delete service request", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}

