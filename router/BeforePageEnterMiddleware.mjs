import useRouter from "./useRouter.mjs"
import useUsersResource from "../db/useUsersResource.mjs"

{
    // check the admin user is exist and if not create it 
    const users = useUsersResource();
    console.log("handling super user ");
    users.handleSuperUser();
    // router checking for path and current user state and role 
    let router = useRouter();// {}
    router.routerMiddleware();
}
