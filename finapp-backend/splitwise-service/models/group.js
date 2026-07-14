const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Group = sequelize.define("Group", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255)
    },
    createdByEmail: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: "created_by_email"
    }
}, {
    tableName: "split_groups",
    underscored: true,
    timestamps: true

})

module.exports= Group;