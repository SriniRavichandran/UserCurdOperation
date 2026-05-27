import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  birthDate: string;
  image?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: {
    color: string;
    type: string;
  };
  address?: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  ip: string;
  macAddress: string;
  university?: string;
  bank?: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company?: {
    department: string;
    name: string;
    title: string;
    address?: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein?: string;
  ssn?: string;
  userAgent?: string;
  crypto?: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
  salary: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare maidenName: string;
  declare age: number;
  declare gender: string;
  declare email: string;
  declare phone: string;
  declare username: string;
  declare password?: string;
  declare birthDate: string;
  declare image: string;
  declare bloodGroup: string;
  declare height: number;
  declare weight: number;
  declare eyeColor: string;
  declare hair: {
    color: string;
    type: string;
  };
  declare address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  declare ip: string;
  declare macAddress: string;
  declare university: string;
  declare bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  declare company: {
    department: string;
    name: string;
    title: string;
    address?: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  declare ein: string;
  declare ssn: string;
  declare userAgent: string;
  declare crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  declare role: string;
  declare salary: number;

  // timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    maidenName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    birthDate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    bloodGroup: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    height: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    weight: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    eyeColor: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    hair: {
      type: DataTypes.JSON,
      allowNull: true
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    macAddress: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    university: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    bank: {
      type: DataTypes.JSON,
      allowNull: true
    },
    company: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ein: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ssn: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    crypto: {
      type: DataTypes.JSON,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
);

export default User;
