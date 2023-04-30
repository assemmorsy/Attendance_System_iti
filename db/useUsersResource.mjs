function useUsersResource() {
    const SUPER_USER = {
        address: "Admin Address",
        admin_confirmation: true,
        birthDay: "1998-06-02",
        email: "admin@admin.com",
        firstName: "Admin",
        lastName: "Admin",
        password: "Admin@123",
        role: "admin",
        username: "admin"
    }

    const resourceName = "users"
    function _getUserByField(fieldName, fieldValue) {
        let allEntities = getAllUsers()
        for (const key in allEntities) {
            if (allEntities[key][fieldName] === fieldValue) {
                return allEntities[key]
            }
        }
        return -1;
    }

    function _getUserByUserName(targetUserName) {
        let allEntities = getAllUsers()
        if (Object.hasOwnProperty.call(allEntities, targetUserName)) {
            return allEntities[targetUserName]
        }
        else {
            return -1;
        }
    }

    function generateUniqueUsernameForUser(user) {
        let counter = 0
        let fullName = `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`;
        fullName = fullName.replaceAll(" ", "");
        let username = `${fullName}${counter}`
        while (_getUserByUserName(username) !== -1) {
            counter++;
            username = `${fullName}${counter}`
        }
        return username
    }

    function handleSuperUser() {
        let users = getAllUsers();
        if (!Object.hasOwnProperty.call(users, SUPER_USER.username)) {
            console.log("handling super user ");
            addUser(SUPER_USER);
        }
    }

    function _setAllUsers(allEntities) {
        localStorage.setItem(resourceName, JSON.stringify(allEntities))
    }

    function _isEmailUsed(inputValue) { // return true if email is used before
        let targetUser = _getUserByField("email", inputValue) // user : used  or -1 :notUsed ;
        return targetUser !== -1; // true if targetUser = user => used 
    }

    function addUser(entity) {
        if (_isEmailUsed(entity.email)) {
            let err = new Error("This Email Is Already Used.");
            err.fieldsNames = ["email"]
            throw err
        }
        let allEntities = getAllUsers()
        allEntities[entity.username] = entity;
        console.log(allEntities);
        _setAllUsers(allEntities)
    }

    function getAllUsers() {
        let users = JSON.parse(localStorage.getItem(resourceName))
        if (users) return users
        else return {}
    }

    function updateUser(username, newUserData) {
        if (_getUserByUserName(username) !== -1) {
            let users = getAllUsers();
            users[username] = { ...users[username], ...newUserData };
            _setAllUsers(users);
        } else {
            throw new Error("user not found");
        }
    }

    function login(userCredentials) {
        let user = _getUserByUserName(userCredentials.username)
        if (user !== -1) {
            if (user.password === userCredentials.password) {
                if (user.admin_confirmation) {
                    return user
                } else {
                    throw new Error("Contact admin for account confirmation.")
                }
            }
        }
        let err = new Error("invalid credentials.")
        err.fieldsNames = ["username", "password"]
        throw err
    }

    return { generateUniqueUsernameForUser, getAllUsers, addUser, login, handleSuperUser, updateUser, _getUserByUserName }
}


export default useUsersResource; 