#!/usr/bin/env node
const yargs = require("yargs");
const client = require("openstack-cli");
const login = require("./login");
const project = require("./project");

const options = yargs
	.usage("Usage: -n <name>")
	.option("u", {alias: "user_name", describe: "Username of openstack account", type: "string"})
	.option("p", {alias: "password", describe: "Password of openstack account", type: "string"})
	.option("i", {alias: "id_project", describe: "Project ID", type: "string"})
	.argv

if(process.argv[2] === "login"){
	if(!options.user_name){
		console.log("Missing user_name")
		process.exit()
	}
	if(!options.password){
		console.log("Missing password")
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
		console.log("Missing project_id")
		process.exit()
	}
	project.showDetailOfInstanceInProject({id_project: options.id_project})
} else {
	console.log("Doc")
}


