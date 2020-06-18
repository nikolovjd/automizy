import ProjectModel from "./project";
import StudentModel from "./student";
import db from '../../../microservice/database/connect'

const ProjectStudentModel = ({
    sequelize,
    DataType
  }) => {
  const {INTEGER, DATE, NOW} = DataType
  const ProjectStudent = sequelize.define("project_student", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: {
      type: DATE,
      defaultValue: NOW
    }
  },{
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'studentId']
      }
    ]
  })

  const projectModel = ProjectModel(db);
  const studentModel = StudentModel(db);

  projectModel.belongsToMany(studentModel, {through: ProjectStudent});
  studentModel.belongsToMany(projectModel, {through: ProjectStudent});

  return ProjectStudent;
}

export default ProjectStudentModel