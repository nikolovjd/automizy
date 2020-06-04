module.exports={
    database: {
        HOST: "127.0.0.1",
        USER: "root",
        PASSWORD: "root",
        DB: "app",
        PORT: 3308,
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: true
    }
}