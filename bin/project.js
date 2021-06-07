const tokenService = require("./token-service");
const rp = require("request-promise");
const config = require("../config/default.json");
const chalk = require("chalk");
const {Table} = require("console-table-printer");

module.exports.showDetail = async () => {
    try{
        let session_in4 = await tokenService.getToken();
        if(!session_in4.token || session_in4.expire_at < Date.now()){
            console.log("unAuthenticated");
        }else {
            let rs = await rp({
                uri: `${config.backend_endpoint}/api/resources/detail`,
                headers: {
                    token: session_in4.token
                },
                method: "GET",
                json: true
            })
            if(rs.success){
                let projects = rs.data.projects.map(project => {
                    return {
                        id: project.id_project,
                        name: project.name,
                        instances: `${project.usage_instance}/${project.total_instance}`,
                        memory: `${project.usage_memory}/${project.total_memory} MB`,
                        cores: `${project.usage_cpu}/${project.total_cpu}`,
                        disk: `${project.usage_disk}/${project.total_disk} GB`,
                    }
                })
                const resource = rs.data.resource;
                const percent_cpu = parseInt(resource.used_cpu * 100 /resource.total_cpu)
                const percent_memory = parseInt(resource.used_memory * 100 /resource.total_memory)
                const percent_disk = parseInt(resource.used_disk * 100 /resource.total_disk)
                console.log(chalk.greenBright("Resource overview: "));
                let resource_table = new Table({
                    columns: [
                        {alignment: "left", name: "Resource"},
                        {alignment: "right", name: "Total"},
                        {alignment: "right", name: "Free"},
                        {alignment: "right", name: "Used"},
                    ]
                })
                resource_table.addRow({
                    Resource: "CPU",
                    Total: resource.total_cpu + " cores",
                    Used: percent_cpu + " %",
                    Free: resource.total_cpu - resource.used_cpu + " cores"
                })
                resource_table.addRow({
                    Resource: "Memory",
                    Total: resource.total_memory + " MB",
                    Used: percent_memory + " %",
                    Free: resource.total_memory - resource.used_memory + " MB"
                })
                resource_table.addRow({
                    Resource: "Disk",
                    Total: resource.total_disk + " GB",
                    Used: percent_disk + " %",
                    Free: resource.total_disk - resource.used_disk + " GB"
                })
                resource_table.printTable()
                console.log();
                console.log(chalk.blueBright("Project detail: "));
                let project_table = new Table({
                    columns: [
                        {name: "id", title: "Project ID", alignment: "center"},
                        {name: "name", },
                        {name: "instances", },
                        {name: "memory", },
                        {name: "cores", },
                        {name: "disk", }
                    ]
                })
                projects.forEach(project => project_table.addRow(project));
                project_table.printTable()
            }else {
                console.error(rs.reason);
            }
        }
    }
    catch(e){
        console.log(e.message)
    }
}

module.exports.showDetailOfInstanceInProject = async ({id_project}) => {
    try{
        let session_in4 = await tokenService.getToken();
        if(!session_in4.token || session_in4.expire_at < Date.now()){
            console.log("unAuthenticated");
        }else {
            let rs = await rp({
                uri: `${config.backend_endpoint}/api/projects/${id_project}/detail`,
                headers: {
                    token: session_in4.token
                },
                method: "GET",
                json: true
            })
            if(rs.success){
                let instances = rs.data.instances.map(instance => {
                    return {
                        id: instance.id_project,
                        name: instance.name,
                        status: instance.status,
                        ip: instance.ip,
                        memory: `${instance.total_memory} MB`,
                        cores: `${instance.total_cpu}`,
                        disk: `${instance.total_disk} GB`
                    }
                })
                const project = rs.data.project;
                const percent_cpu = parseInt(project.usage_cpu * 100 /project.total_cpu)
                const percent_memory = parseInt(project.usage_memory * 100 /project.total_memory)
                const percent_disk = parseInt(project.usage_disk * 100 /project.total_disk)
                const percent_instance = parseInt(project.usage_instance * 100 /project.total_instance)
                console.log(chalk.greenBright("Project overview: "), chalk.yellowBright(project.name));
                let project_table = new Table({
                    columns: [
                        {alignment: "left", name: "Resource"},
                        {alignment: "right", name: "Total"},
                        {alignment: "right", name: "Free"},
                        {alignment: "right", name: "Used"},
                    ]
                })

                project_table.addRow({
                    Resource: "CPU",
                    Total: project.total_cpu + " cores",
                    Used: percent_cpu + " %",
                    Free: project.total_cpu - project.usage_cpu + " cores",

                })
                project_table.addRow({
                    Resource: "Memory",
                    Total: project.total_memory + " MB",
                    Used: percent_memory + " %",
                    Free: project.total_memory - project.usage_memory + " MB"
                })
                project_table.addRow({
                    Resource: "Disk",
                    Total: project.total_disk + " GB",
                    Used: percent_disk + " %",
                    Free: project.total_disk - project.usage_disk + " GB"
                })
                project_table.addRow({
                    Resource: "Instance",
                    Total: project.total_instance,
                    Used: percent_instance + " %",
                    Free: project.total_instance - project.usage_instance
                })

                project_table.printTable()
                console.log();
                console.log(chalk.blueBright("Instance detail: "));
                let instance_table = new Table({
                    columns: [
                        {name: "id", title: "Instance ID", alignment: "center"},
                        {name: "name", alignment: "left", title: "Name"},
                        {name: "status", alignment: "left", title: "Status"},
                        {name: "ip", alignment: "left", title: "Ip"},
                        {name: "memory", alignment: "left", title: "Memory"},
                        {name: "cores", alignment: "left", title: "Cores"},
                        {name: "disk", alignment: "left", title: "Disk"}
                    ]
                })
                instances.forEach(instance => instance_table.addRow(instance));
                instance_table.printTable()
            }else {
                console.error(rs.reason);
            }
        }
    }
    catch(e){
        console.log(e.message)
    }
}