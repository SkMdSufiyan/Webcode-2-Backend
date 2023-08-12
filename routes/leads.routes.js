const express = require('express');
const {getAllLeads, getSingleLeadByID, addLead, updateLead, deleteLead} = require('../controllers/leads.controller.js');
const { attachProfileOfUser } = require('../controllers/users.controller.js');
const { requireSignIn, isAuth } = require('../utils/authentication.js');
const { isAdminOrManagerOrEmployeeWithRights } = require('../utils/authorization.js');


const leadsRouter = express.Router();


// "userID" is the id of the user who performs the action on leads

leadsRouter.get('/:userID/leads', requireSignIn, isAuth, getAllLeads);

leadsRouter.get('/:userID/leads/:leadID', requireSignIn, isAuth, getSingleLeadByID);

leadsRouter.post('/:userID/leads', requireSignIn, isAuth, isAdminOrManagerOrEmployeeWithRights, addLead);

leadsRouter.put('/:userID/leads/:leadID', requireSignIn, isAuth, isAdminOrManagerOrEmployeeWithRights, updateLead);

leadsRouter.delete('/:userID/leads/:leadID', requireSignIn, isAuth, isAdminOrManagerOrEmployeeWithRights, deleteLead);


leadsRouter.param("userID", attachProfileOfUser);

module.exports = leadsRouter;


