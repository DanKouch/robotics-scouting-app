// Routes all users can access, reguardless of whether they are logged in or not
const exposed = FlowRouter.group();

exposed.route("/", {
	name: "index",
	action: function(){
		// Index routes to dashboard if client is logged in, to login screen if not
		if(Meteor.loggingIn() || Meteor.userId()){
			FlowRouter.go(FlowRouter.path("dashboard"));
		}else{
			FlowRouter.go(FlowRouter.path("login"));
		}
	}
})

exposed.route("/login", {
	name: "login",
	action: function(){
		BlazeLayout.render("app_body", {main: "login"});
	}
});

// Routes that users can only access if they are logged in
const conceiled = FlowRouter.group({
	triggersEnter: [function() {
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
	action: function() {BlazeLayout.render("app_body", {main: "dashboard"})}
})

conceiled.route("/profile", {
	name: "profile",
	action: function() {BlazeLayout.render("app_body", {main: "profile"})}
})

conceiled.route("/task:taskid", {
	name: "task",
	action: function() {BlazeLayout.render("app_body", {main: "task"})}
})

conceiled.route("/logout", {
	name: "logout",
	action: function() {
		Meteor.logout();
		FlowRouter.go(FlowRouter.path("login"));
	}
})

// Routes only logged in admins can access
const adminConceiled = conceiled.group({
	prefix: "/admin",
	triggersEnter: [function() {
		if(!Roles.userIsInRole(Meteor.user(), ['admin'])){
			FlowRouter.go(FlowRouter.path("dashboard"));
		}
	}]
})

adminConceiled.route("/users", {
	name: "registerUser",
	action: function() {BlazeLayout.render("app_body", {main: "registerUser"})}
});

// Utility Routes
FlowRouter.notFound = {
	action: function() {
		BlazeLayout.render("app_body", {main: "not_found"})
	}
}