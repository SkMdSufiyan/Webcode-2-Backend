const express = require('express');
const {getAllServiceRequests, getSingleServiceRequestByID, addServiceRequest, updateServiceRequest, deleteServiceRequest} = require('../controllers/serviceRequests.controller.js');
const { attachProfileOfUser } = require('../controllers/users.controller.js');
const { requireSignIn, isAuth } = require('../utils/authentication.js');
const { isAdminOrManagerOrEmployeeWithRights } = require('../utils/authorization.js');


const serviceReqRouter = express.Router();

serviceReqRouter.get('/:userID/serviceRequests', requireSignIn, isAuth, getAllServiceRequests);

serviceReqRouter.get('/:userID/serviceRequests/:serviceRequestID', requireSignIn, isAuth, getSingleServiceRequestByID);

serviceReqRouter.post('/:userID/serviceRequests', requireSignIn, isAuth, isAdminOrManagerOrEmployeeWithRights, addServiceRequest);

serviceReqRouter.put('/:userID/serviceRequests/:serviceRequestID', requireSignIn, isAuth, isAdminOrManagerOrEmployeeWithRights, updateServiceRequest);

serviceReqRouter.delete('/:userID/serviceRequests/:serviceRequestID', requireSignIn, isAuth, isAdminOrManagerOrEmployeeWithRights, deleteServiceRequest);


serviceReqRouter.param("userID", attachProfileOfUser);


module.exports = serviceReqRouter;

