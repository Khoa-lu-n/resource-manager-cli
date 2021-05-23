#!/usr/bin/env node
const yargs = require("yargs");
const client = require("openstack-cli");
const login = require("./login");
const project = require("./project");

const options = yargs
	.scriptName("resource-manager")
	.usage('$0 <cmd> [args]')
	.command("login [user_name] [password]", "Login.")
	.command("resource detail", "Show resource overview and projects detail.")
	.command("project [id_project] detail", "Show project overview and instances detail.")
	.option("u", {alias: "user_name", describe: "Username of openstack account", type: "string"})
	.option("p", {alias: "password", describe: "Password of openstack account", type: "string"})
	.option("i", {alias: "id_project", describe: "Project ID", type: "string"})
	.argv

if(process.argv[2] === "login"){
	if(!options.user_name){
		console.log("Missing option user_name")
		process.exit()
	}
	if(!options.password){
		console.log("Missing option password")
		process.exit()
	}
	login({
		username: options.user_name, 
		password: options.password
	})
} else if(process.argv[2] === "resource" && process.argv[3] === "detail"){
	project.showDetail()
} else if(process.argv[2] === "project" && process.argv[3] === "detail"){
	if(!options.id_project){
		console.log("Missing option project_id")
		process.exit()
	}
	project.showDetailOfInstanceInProject({id_project: options.id_project})
} else {
	console.log("Doc")
}


