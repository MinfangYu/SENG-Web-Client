import { createWebHistory, createRouter } from 'vue-router';
import Home from "@/views/Home";
import Register from "@/views/Register";
import Login from "@/views/Login";
import Profile from "@/views/Profile";
import ChangeProfile from "@/views/ChangeProfile";
import Events from "@/views/Events";
import EventDetails from "@/views/EventDetails";
import CreateEvent from "@/views/CreateEvent";
import EditEvent from "@/views/EditEvent";
import MyEvents from "@/views/MyEvents";

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
        meta: {
            isLogin: false
        }
    },
    {
        path: "/users/register",
        name: "register",
        component: Register,
        meta: {
            isLogin: false
        }
    },
    {
        path: "/users/login",
        name: "login",
        component: Login,
        meta: {
            isLogin: false
        }
    },
    {
        path: "/users/my",
        name: "profile",
        component: Profile,
        meta: {
            isLogin: true
        }
    },
    {
        path: "/users/my/patch",
        name: "changeProfile",
        component: ChangeProfile,
        meta: {
            isLogin: true
        }
    },
    {
        path: "/events",
        name: "Events",
        component: Events,
        meta: {
            isLogin: false
        }
    },
    {
        path: "/events/details",
        name: "EventDetails",
        component: EventDetails,
        meta: {
            isLogin: false
        }
    },
    {
        path: "/events/create",
        name: "CreateEvent",
        component: CreateEvent,
        meta: {
            isLogin: true
        }
    },
    {
        path: "/events/edit",
        name: "EditEvent",
        component: EditEvent,
        meta: {
            isLogin: true
        }
    },
    {
        path: "/events/my",
        name: "MyEvents",
        component: MyEvents,
        meta: {
            isLogin: true
        }
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

router.beforeEach((to, from, next) => {
    if(sessionStorage.data) {
        if (to.path === "/users/login") {
            next({path: "/users/:id"});
        } else {
            next();
        }
    } else {
        next();
        // if (to.path === "/users/login" || to.path === "/" || to.path === "/users/register") {
        //     next();
        // } else {
        //     next({path: "/users/login"})
        // }
    }
})

export default router;