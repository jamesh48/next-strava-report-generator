import { Model, BuildOptions, Sequelize, DataTypes } from "sequelize";

export interface AccessTokenAttributes {
  id?: number;
  athleteId: number;
  username?: string;
  readScope?: boolean;
  readAllScope?: boolean;
  accessToken: string;
  expiresAt: number;
}

export interface AccessTokenModel
  extends Model<AccessTokenAttributes>,
    AccessTokenAttributes {}

export class AccessToken extends Model<
  AccessTokenModel,
  AccessTokenAttributes
> {}

export type AccessTokenStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): AccessTokenModel;
};

export function AccessTokenFactory(sequelize: Sequelize): AccessTokenStatic {
  return <AccessTokenStatic>sequelize.define("accesstoken", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      // This is important for making sure that ignoreDuplicates works correctly
      unique: true
    },
    athleteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    readScope: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    readAllScope: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
}
