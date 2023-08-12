const usersModel = require('../models/users.model.js');
const bcrypt = require('bcrypt');


exports.getAllUsers = async (req, res) => {
    try{
        await usersModel.find()
        .then(documents => {
            res.status(200).send({message : "All the users data is obtained successfully", data : documents});
        })
        .catch(err => {
            res.status(400).send({message : "Failed to obtain users data", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


exports.getSingleUserByID = async (req, res) => {
    try{
        const userID = req.params.userID;
        await usersModel.findOne({_id : userID})
        .then( result => {
            
            if(result){
                res.status(200).send({message : "User data is obtained successfully", data : result});
            }else{
                res.status(400).send({message : "User not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to obtain the user data", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}



exports.addUser = async (req, res) => {
    try{
        const payload = req.body;
        const email = payload.email;

        const userExists = await usersModel.findOne({email : email});

        if(userExists){
            return res.status(401).send({message : `User with email id ${email} already exists in the database`});
        }

        const hashValue = await bcrypt.hash(payload.password, 10);

        payload.hashedPassword = hashValue;
        delete payload.password;

        payload.isActivated = true;

        const newUser = new usersModel(payload);

        await newUser.save()
        .then(result => {
            res.status(200).send({message : "User is added and activated successfully", _id :  result._id});
        })
        .catch(err => {
            res.status(400).send({message : "Failed to add the user", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}



// Email and password can not be updated (to update password, reset password option is there)
// Only the name and type of user can be updated
exports.updateUser = async (req, res) => {
    try{
        
        const userID = req.params.userID;
        const payload = req.body;

        await usersModel.findOneAndUpdate({_id : userID}, {$set : payload})
        .then(result => {
            if(result){
                res.status(200).send({message : "User is updated successfully"});
            }else{
                res.status(400).send({message : "User not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to update the user", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const userID = req.params.userID;

        await usersModel.findOneAndDelete({_id : userID})
        .then(result => {
            if(result){
                res.status(200).send({message : "User is deleted successfully"});
            }else{
                res.status(400).send({message : "User not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to delete the user", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}





exports.attachProfileOfUser = async (req, res, next, id) => {
    try{
        const data = await usersModel.findOne({ _id : id});
            if(! data){
                return res.status(400).send({message : "User does not exist"});
            }
            req.profile = data; // Adding the profile of the user to verify whether he is an admin, or a manager, or an employee with rights, or an employee without rights
            
            next();

    }catch(error){
        
        res.status(500).send({message : "Internal server error"});
    }
}


