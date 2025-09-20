import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface EndpointAttributes {
  id: number;
  url: string;
  methodHttp: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface EndpointCreationAttributes
  extends Optional<EndpointAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Endpoint
  extends Model<EndpointAttributes, EndpointCreationAttributes>
  implements EndpointAttributes
{
  public id!: number;
  public url!: string;
  public methodHttp!: string;
  public data!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initEndpointModel = (sequelize: Sequelize) => {
  Endpoint.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      methodHttp: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "GET",
        validate: {
          isIn: [["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]],
        },
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "endpoints",
      timestamps: true,
    }
  );

  return Endpoint;
};
