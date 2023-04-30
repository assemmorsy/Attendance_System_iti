import useUsersResource from "./useUsersResource.mjs"
let useUsers = useUsersResource()
function useCurrentUserResource() {
    const KEY = "CURRENT_USER"
    function addCurrentUser(user) {
        sessionStorage.setItem(KEY, JSON.stringify(user.username))
    }
    function getCurrentUser() {
        return (useUsers.getAllUsers())[JSON.parse(sessionStorage.getItem(KEY))]
    }
    function removeCurrentUser() {
        return sessionStorage.removeItem(KEY)
    }
    return {
        addCurrentUser, removeCurrentUser, getCurrentUser
    }
}
export default useCurrentUserResource;