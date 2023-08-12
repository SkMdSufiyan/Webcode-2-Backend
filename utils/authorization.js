exports.isAdmin = (req, res, next) => {
    const admin = req.profile.typeOfUser === "Admin";

    if( ! admin ){
        return res.status(404).send({message : "Access denied !!! Admin resource !!!"});
    }

    next();
}


exports.isAdminOrManager = (req, res, next) => {
    const adminOrManager = req.profile.typeOfUser === "Admin" || req.profile.typeOfUser === "Manager";

    if( ! adminOrManager ){
        return res.status(400).send({message : "Access denied !!! Admin or Manager resource !!!"});
    }

    next();
}


exports.isAdminOrManagerOrEmployeeWithRights = (req, res, next) => {
    const adminOrManagerOrEmployeeWithRights = req.profile.typeOfUser === "Admin" || req.profile.typeOfUser === "Manager" || req.profile.typeOfUser === "Employee with rights";

    if ( ! adminOrManagerOrEmployeeWithRights ){
        return res.status(404).send({message : "Access denied !!! Admin or Manager or Employee with rights resource !!!"});
    }

    next();
}


