import path from 'path'
import grpc from 'grpc'
const protoLoader = require("@grpc/proto-loader")
import config from '../../config/service'
import db from '../../microservice/database/connect'
import ProjectStudentModel from '../../microservice/database/model/project-student'
const PROTO_PATH = path.join(__dirname, '../../proto/management.proto')
const STUDENT_PROTO_PATH = path.join(__dirname, '../../proto/student.proto')
const PROJECT_PROTO_PATH = path.join(__dirname, '../../proto/project.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const studentPackageDefinition = protoLoader.loadSync(STUDENT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const projectPackageDefinition = protoLoader.loadSync(PROJECT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

// Load in our service definition
const managementProto = grpc.loadPackageDefinition(packageDefinition).management
const studentProto = grpc.loadPackageDefinition(studentPackageDefinition).student
const projectProto = grpc.loadPackageDefinition(projectPackageDefinition).project
const server = new grpc.Server()

const projectClient = new projectProto.ProjectService(config.project.host +':'+ config.project.port, grpc.credentials.createInsecure());
const studentClient = new studentProto.StudentService(config.student.host +':'+ config.student.port, grpc.credentials.createInsecure());

const projectStudentModel = ProjectStudentModel(db)

// GRPC calls to other microservices
const projectsHydrate = async (ids) => {
  return new Promise((resolve, reject) => {
    projectClient.Hydrate({ ids }, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

const studentsHydrate = async (ids) => {
  return new Promise((resolve, reject) => {
    studentClient.Hydrate({ ids }, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

// Implement the list function
const List = async (call, callback) => {
  const options = {
    attributes: ['projectId', 'studentId'],
    order: [['projectId', 'ASC'], ['studentId', 'ASC']],
    raw: true
  }

  try{
    const projectStudentsResult = await projectStudentModel.findAll(options)
    const projectIds = [...new Set(projectStudentsResult.map(e => e.projectId))]
    const studentIds = [...new Set(projectStudentsResult.map(e => e.studentId))]
    const { projects } = await projectsHydrate(projectIds)
    const { students } = await studentsHydrate(studentIds)

    // TODO: this can be optimized, however this request should be paginated anyway, and in that case it's not a huge drawback
    const result = []
    for (const projectId of projectIds) {
      const project = projects.find(p => Number(p.id) === projectId)
      // TODO: Error handling
      if (!project) {
        continue;
      }
      const currentStudentIds = projectStudentsResult.filter(ps => ps.projectId === projectId).map(p => p.studentId)
      const projectStudents = []
      for (const cStudentId of currentStudentIds) {
        const student = students.find(s => Number(s.id) === cStudentId)
        // TODO: Error handling
        if (!student) {
          continue;
        }
        projectStudents.push(student)
      }
      project.students = projectStudents
      result.push(project)
    }
    callback(null, {projects: result})
  }
  catch(err){
    callback({
      code: grpc.status.ABORTED,
      details: "Aborted"
    })
  }
}

// Implement the add function (add student to project)
const Add = async (call, callback) => {
  const { projectId, studentId } = call.request
  try{
    await projectStudentModel.create({ projectId, studentId });
    callback(null, {})
  }
  catch(err){
    switch(err.name) {
      case 'SequelizeUniqueConstraintError': {
        let jsErr = new Error('ALREADY_EXISTS')
        jsErr.code = grpc.status.ALREADY_EXISTS
        jsErr.metadata = dbErrorCollector({errors: err.errors})
        callback(jsErr)
        break
      }
      case 'SequelizeForeignKeyConstraintError': {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: "Not Found"
        })
      }
      default:
        callback({
          code: grpc.status.ABORTED,
          details: "ABORTED"
        })
    }
  }
}

// Implement the remove function (remove student from project)
const Remove = async (call, callback) => {
  const { projectId, studentId } = call.request
  try{
    const projectStudent = await projectStudentModel.findOne({ where: { projectId, studentId } });
    if (!projectStudent) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Not Found"
      })
    }
    await projectStudent.destroy();
    callback(null, {})
  }
  catch(err){
    callback({
      code: grpc.status.ABORTED,
      details: "Aborted"
    })
  }
}

// Collect errors
const dbErrorCollector=({
                          errors
                        })=>{
  const metadata = new grpc.Metadata()
  const error = errors.map(item => {
    metadata.set(item.path, item.type)
  })
  return metadata
}
const exposedFunctions = {
  List,
  Add,
  Remove
}

server.addService(managementProto.ManagementService.service, exposedFunctions)
server.bind(config.management.host +':'+ config.management.port, grpc.ServerCredentials.createInsecure())

db.sequelize.sync().then(() => {
  console.log("Re-sync db.")
  server.start()
  console.log('Server running at ' + config.management.host +':'+ config.management.port)
})
  .catch(err => {
    console.log('Can not start server at ' + config.management.host +':'+ config.management.port)
    console.log(err)
  })