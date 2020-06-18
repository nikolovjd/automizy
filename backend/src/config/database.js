module.exports={
    database: {
        HOST: "db",
        USER: "root",
        PASSWORD: "root",
        DB: "app",
        PORT: 3306,
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