import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface RefreshTokenAttributes {
  id?: number;
  athleteId: number;
  refreshToken: string;
  readScope?: boolean;
  readAllScope?: boolean;
}

export interface RefreshTokenModel
  extends Model<RefreshTokenAttributes>,
    RefreshTokenAttributes {}

export class RefreshToken extends Model<
  RefreshTokenModel,
  RefreshTokenAttributes
> {}

export type RefreshTokenStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RefreshTokenModel;
};

export function RefreshTokenFactory (sequelize: Sequelize): RefreshTokenStatic {
  return <RefreshTokenStatic>sequelize.define("refreshtoken", {
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
    refreshToken: {
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
    }
  });
};
