module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            // release_date: { type:DataTypes.DATE },
            // end_date: { type:DataTypes.DATE },
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            nombre: {
                type:DataTypes.STRING,
            }, 
            apellido: {
                type:DataTypes.STRING,
            }, 
            email: {
                type:DataTypes.STRING,
            },
            password:{
                type:DataTypes.STRING,
            },
            dni: {
                type:DataTypes.STRING
            },
            fecha: {
                type:DataTypes.STRING
            },
            foto: {
                type:DataTypes.STRING
            }
        },
        {
            tableName:"users",
            // createdAt:"created_at",
            // updatedAt:"updated_at",
            timestamps:false
        }
    )

    return User
}