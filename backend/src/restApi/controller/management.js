import { body, validationResult } from 'express-validator'
import path from 'path'
import grpc from 'grpc'
const protoLoader = require("@grpc/proto-loader")
import config from '../../config/service'
const PROTO_PATH = path.join(__dirname, '../../proto/management.proto')

exports.validationRules = (method) => {
    switch (method) {
        case 'add': {
            return [
                body('projectId').not().isEmpty(),
                body('studentId').not().isEmpty(),
            ]
        }
        case 'remove': {
            return [
                body('projectId').not().isEmpty(),
                body('studentId').not().isEmpty(),
            ]
        }
    }
}

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(400).json({
        errors: extractedErrors
    })
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})

// Load in our service definition
const projectProto = grpc.loadPackageDefinition(packageDefinition).management
const client = new projectProto.ManagementService(config.management.host +':'+ config.management.port, grpc.credentials.createInsecure())

const projectList = async (options) => {
    return new Promise((resolve, reject) => {
      client.List(options, (error, response) => {
            if (error) { reject(error) }
            resolve(response)
        })
    })
}

exports.list = async (req, res, next) => {
    try{
        let result = await projectList()
        res.status(200).json(result)
    } catch(e){
        res.json(e)
    }
}

const projectAddStudent = async (options) => {
    return new Promise((resolve, reject) => {
        client.Add(options, (error, response) => {
            if (error) { reject(error) }
            resolve(response)
        })
    })
}

exports.add = async (req, res, next) => {
    try{
        await projectAddStudent({
            projectId: req.body.projectId,
            studentId: req.body.studentId
        })
        res.status(200).json({ success: true })
    } catch(err){
        switch(err?.details){
            case 'ALREADY_EXISTS':
                res.status(409).json({
                    error: err.metadata.getMap()
                })
                break
            default:
                res.status(500).json(err)
        }
    }
}

const projectRemoveStudent = async (options) => {
    return new Promise((resolve, reject) => {
        client.Remove(options, (error, response) => {
            if (error) { reject(error) }
            resolve(response)
        })
    })
}

exports.remove = async (req, res, next) => {
    try{
        await projectRemoveStudent({
            projectId: req.body.projectId,
            studentId: req.body.studentId
        })
        res.status(200).json({success: true})
    } catch(e){
        res.json(e)
    }
}


