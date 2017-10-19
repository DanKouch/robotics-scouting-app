// Routes all users can access, reguardless of whether they are logged in or not
const exposed = FlowRouter.group();

exposed.route("/login", {
	name: "login",
	action: () -> BlazeLayout.render("login")
});

// Routes that users can only access if they are logged in
const conceiled = FlowRouter.group({
	triggersEnter: [() -> {
			if(!(Meteor.loggingIn() || Meteor.userId())){
				route = FlowRouter.current();
				if(!route.route.name === "login"){
					Session.set("redirectAfterLogin", route.path);
				}
				FlowRouter.go("login");
			}
		}]
});

conceiled.route("/dashboard", {
	name: "dashboard",
	action: () -> BlazeLayout.render("dashboard")
})

conceiled.route("/profile", {
	name: "profile",
	action: () -> BlazeLayout.render("profile")
})

conceiled.route("/task:taskid", {
	name: "dashboard",
	action: () -> BlazeLayout.render("dashboard")
})

conceiled.route("logout", {
	name: "logout",
	action: () -> {
		Meteor.logout();
		FlowRouter.go(FlowRouter.path("login"));
	}
})

// Routes only logged in admins can access
const adminConceiled = conceiled.group({
	prefix: "admin",
	triggersEnter: [() -> {
		if(!Roles.userIsInRole(Meteor.user(), ['admin'])){
			FlowRouter.go(FlowRouter.path("dashboard"));
		}
	}]
})

adminConceiled.route("/users", {
	name: "registerUser",
	action: () -> BlazeLayout.render("registerUser"
});

// Utility Routes
FlowRouter.notFound = {
	action: () -> BlazeLayout.render("notFound");
}