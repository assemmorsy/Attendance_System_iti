import useCurrentUserResource from "../db/useCurrentUserResource.mjs"

function useRouter() {
    let useCurrentUser = useCurrentUserResource()
    const Routes = [
        { displayName: "_", publish: false, path: "/", name: "index", beforeEnter: [indexGuard], role: [] },

        { displayName: "_", publish: false, path: "/404.html", name: "404", beforeEnter: [], role: [] },
        { displayName: "_", publish: false, path: "/login.html", name: "login", beforeEnter: [alreadyAuth], role: [] },
        { displayName: "_", publish: false, path: "/signup.html", name: "signup", beforeEnter: [alreadyAuth], role: [] },
        { displayName: "_", publish: false, path: "/confirmationWait.html", name: "confirm", beforeEnter: [], role: [] },
        { displayName: "Home", publish: true, path: "/home.html", name: "home", beforeEnter: [needAuth], role: ["admin", "employee", "security_man"] },
        { displayName: "Profile", publish: true, path: "/profile.html", name: "profile", beforeEnter: [needAuth], role: ["admin", "employee", "security_man"] },
        { displayName: "Attendance", publish: true, path: "/attendance.html", name: "attendance", beforeEnter: [needAuth], role: ["security_man"] },
        { displayName: "Admin Confirmation", publish: true, path: "/adminConfirmation.html", name: "adminConfirmation", beforeEnter: [needAuth], role: ["admin"] },
        { displayName: "Admin Reports", publish: true, path: "/adminReports.html", name: "adminReports", beforeEnter: [needAuth], role: ["admin"] },
    ]

    function indexGuard() {
        let user = useCurrentUser.getCurrentUser()
        if (!user) {
            goto("login")
        }
        else {
            goto("home")
        }
    }

    function needAuth() {
        let user = useCurrentUser.getCurrentUser()
        if (!user) {
            goto("login")
        }
        else {
            if (!_getRouteByPath(location.pathname).role.includes(user.role)) {
                goto("home")
            }
        }
    }

    function alreadyAuth() {
        let user = useCurrentUser.getCurrentUser() //session storage 
        if (user) {
            goto("home")
        }
    }

    function _getRouteByName(name) {
        let route = Routes.find((r) => r.name === name)
        return route ? route : -1
    }

    function _getRouteByPath(path) {
        let route = Routes.find((r) => r.path === path)
        return route ? route : -1
    }

    function goto(name) {
        let route = _getRouteByName(name)
        if (route !== -1) {
            window.open(route.path, "_self")
        } else {
            goto("404")
            throw new Error("can't find this Route")
        }
    }

    function routerMiddleware(user) {
        let currentRoute = _getRouteByPath(window.location.pathname);
        currentRoute.beforeEnter.forEach((fn) => fn(user))
    }
    return { routerMiddleware, goto, Routes }
}



export default useRouter;
