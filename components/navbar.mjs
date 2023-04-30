import useCurrentUserResource from "../db/useCurrentUserResource.mjs"
import useRouter from "../router/useRouter.mjs"


const navContent = `<nav class="navbar navbar-expand-md bg-light">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="./home.html">
                                <i class="fa-solid fa-clipboard-user fa-2x text-primary"></i>
                            </a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav ms-auto mb-2 mb-md-0">
                                
                                </ul>
                                <button class="btn btn-primary" id="logout_btn">Logout</button>
                            </div>
                        </div>
                    </nav>
                    `

class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = navContent;
        let router = useRouter() //router
        let useCurrentUser = useCurrentUserResource()
        let user = useCurrentUser.getCurrentUser();//current user
        // logout btn event

        this.querySelector("#logout_btn").addEventListener("click", function () {
            useCurrentUser.removeCurrentUser();
            router.goto("login");
        })

        // role specify lis 
        const ul = this.querySelector(".navbar-nav")
        router.Routes.forEach((route) => {
            if (route.publish && route.role.includes(user.role)) {
                let li = document.createElement("li")
                li.classList.add("nav-item")
                li.innerHTML += ` <a class="nav-link" aria-current="page" href="${route.path}">${route.displayName}</a>`;
                ul.appendChild(li)
            }
        })

        // active class in li 
        const lis = this.querySelectorAll(".nav-link")
        lis.forEach((li) => {
            if (li.href.includes(location.pathname)) {
                li.classList.add("active")
            } else {
                li.classList.remove("active")
            }
        })

    }
}



customElements.define("navbar-component", Navbar);

// export default Navbar;