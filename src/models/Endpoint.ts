import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface EndpointAttributes {
  id: number;
  url: string;
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
  public data!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
