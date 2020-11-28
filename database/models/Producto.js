module.exports = (sequelize, dataTypes) => {

    let alias = 'Productos';
    let cols = {
        id:{
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title:{
            type: dataTypes.STRING
        },
        length:{
            type: dataTypes.INTEGER
        }
    };
    let config = {
        tableName: 'productos',
        timestamps: false
    };

    const Producto = sequelize.define(alias,cols,config);

    return Producto;

}