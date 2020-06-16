import { body, validationResult } from 'express-validator'
import path from 'path'
import grpc from 'grpc'
const protoLoader = require("@grpc/proto-loader")
import config from '../../config/service'
const PROTO_PATH = path.join(__dirname, '../../proto/project.proto')

exports.validationRules = (method) => {
    switch (method) {
        case 'create': {
            return [
                body('name').not().isEmpty()
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
const projectProto = grpc.loadPackageDefinition(packageDefinition).project
const client = new projectProto.ProjectService(config.project.host +':'+ config.project.port, grpc.credentials.createInsecure())

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

const projectCreate = (options) => {
    return new Promise((resolve, reject) => {
      client.Create(options, (error, response) => {
            if (error) { reject(error) }
            resolve(response)
        })
    })
}

exports.create = async (req, res, next) => {
    try{
        let result = await projectCreate({
            "name": req.body.name,
            "desc": req.body.desc,
        })
        res.status(201).json(result)
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

const projectRead = (options) => {
    return new Promise((resolve, reject) => {
      client.Read(options, (error, response) => {
            if (error) { reject(error) }
            resolve(response)
        })
    })
}

exports.read = async (req, res, next) => {
    try{
        let result = await projectRead({
            "id": req.params.id
        })
        res.status(200).json(result)
    } catch(e){
        if(e.details === 'Not found'){
            res.status(200).json(e)
        }
        else{
            res.status(500).json(e)
        }
    }
}

const projectUpdate = (options) => {
    return new Promise((resolve, reject) => {
      client.Update(options, (error, response) => {
            if (error) { reject(error) }
            resolve(response)
        })
    })
}

exports.update = async (req, res, next) => {
    try{
        let result = await projectUpdate({
            "id": req.params.id,
            "name": req.body.name,
            "desc": req.body.desc,
        })
        res.status(200).json({id: req.params.id})
    } catch(e){
        if(e.details === 'Not found'){
            res.status(404).json(e)
        }
        else{
            res.status(500).json(e)
        }
    }
}

const projectDelete = (options) => {
    return new Promise((resolve, reject) => {
      client.Delete(options, (error, response) => {
            if (error) { reject(error) }
            resolve(response)
        })
    })
}

exports.delete = async (req, res, next) => {
    try{
        let result = await projectDelete({
            "id": req.params.id
        })
        res.status(200).json({id: req.params.id})
    } catch(e){
        if(e.details === 'Not found'){
            res.status(404).json(e)
        }
        else{
            res.status(500).json(e)
        }
    }
}