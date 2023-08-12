const leadsModel = require('../models/leads.model.js');
const usersModel = require('../models/users.model.js');
const {emailSendingFunction} = require('./emailSender.js');


exports.getAllLeads = async (req, res) => {
    try{
        await leadsModel.find()
        .then(documents => {
            res.status(200).send({message : "All the leads data is obtained successfully", data : documents});
        })
        .catch(err => {
            res.status(400).send({message : "Failed to obtain the leads data", error : err })
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.getSingleLeadByID = async (req, res) => {
    try{
        const leadID = req.params.leadID;

        await leadsModel.findOne({_id : leadID})
        .then(result => {
            if(result){
                res.status(200).send({message : "Lead data is obtained successfully", data : result});
            }else{
                res.status(400).send({message : "Lead not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to obtain the lead data", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.addLead = async (req, res) => {
    try{
        const payload = req.body;
        const newLead = new leadsModel(payload);

        const adminsOrManagersEmailIDs = await usersModel.find({typeOfUser : {$in : ["Admin", "Manager"] }}, {_id : 0, email : 1});

        await newLead.save()
        .then(result => {
            const emailSubject = "A new lead is added in the CRM app.";
            const emailMessage = `A new lead with _id ${result._id} is added.`;
            const successfullyTriggeredEmailTo = [];

            if(adminsOrManagersEmailIDs.length > 0){
                adminsOrManagersEmailIDs.map(val => {
                    const emailSent = emailSendingFunction(val.email, emailSubject, emailMessage);
                    if(emailSent){
                        successfullyTriggeredEmailTo.push(val.email);
                    }
                });
            }
            

            res.status(200).send({message : "Lead is added successfully", _id : result._id, successfullyTriggeredEmailTo : successfullyTriggeredEmailTo});
        })
        .catch(err => {
            res.status(400).send({message : "Failed to add the lead", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.updateLead = async (req, res) => {
    try{
        const leadID = req.params.leadID;
        const payload = req.body;

        await leadsModel.findOneAndUpdate({_id : leadID}, {$set : payload})
        .then(result => {
            if(result){
                res.status(200).send({message : "Lead is updated successfully"});
            }else{
                res.status(400).send({message : "Lead not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to update the lead", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.deleteLead = async (req, res) => {
    try{
        const leadID = req.params.leadID;

        await leadsModel.findOneAndDelete({_id : leadID})
        .then(result => {
            if(result){
                res.status(200).send({message : "Lead is deleted successfully"});
            }else{
                res.status(400).send({message : "Lead not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to delete the lead", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}