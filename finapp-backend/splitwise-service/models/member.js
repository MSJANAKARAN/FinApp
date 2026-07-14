const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Group = require("./Group");

const Member = sequelize.define("Member", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    memberName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "member_name"
    },
    memberEmail: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: "member_email"
    },
    role: {
        type: DataTypes.ENUM(
            "OWNER",
            "ADMIN",
            "MEMBER"
        ),
        allowNull: false,
        defaultValue: "MEMBER"
    }
}, {
    tableName: "split_members",
    underscored: true,
    timestamps: false,
    createdAt: "joined_at",
    updatedAt: false
});

Group.hasMany(Member, {
    foreignKey: "group_id",
    as: "members",
    onDelete: "CASCADE"
});

Member.belongsTo(Group, {
    foreignKey: "group_id",
    as: "group"
});

module.exports = Member;