import Joi from 'joi';

const hairSchema = Joi.object({
  color: Joi.string().allow('', null),
  type: Joi.string().allow('', null)
});

const coordinatesSchema = Joi.object({
  lat: Joi.number().allow(null),
  lng: Joi.number().allow(null)
});

const addressSchema = Joi.object({
  address: Joi.string().allow('', null),
  city: Joi.string().allow('', null),
  state: Joi.string().allow('', null),
  stateCode: Joi.string().allow('', null),
  postalCode: Joi.string().allow('', null),
  coordinates: coordinatesSchema.allow(null),
  country: Joi.string().allow('', null)
});

const bankSchema = Joi.object({
  cardExpire: Joi.string().allow('', null),
  cardNumber: Joi.string().allow('', null),
  cardType: Joi.string().allow('', null),
  currency: Joi.string().allow('', null),
  iban: Joi.string().allow('', null)
});

const companySchema = Joi.object({
  department: Joi.string().allow('', null),
  name: Joi.string().allow('', null),
  title: Joi.string().allow('', null),
  address: addressSchema.allow(null)
});

const cryptoSchema = Joi.object({
  coin: Joi.string().allow('', null),
  wallet: Joi.string().allow('', null),
  network: Joi.string().allow('', null)
});

export const createUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  maidenName: Joi.string().allow('', null),
  age: Joi.number().integer().min(0).max(150).required(),
  gender: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(4).max(50).required(),
  birthDate: Joi.string().required(),
  image: Joi.string().allow('', null),
  bloodGroup: Joi.string().allow('', null),
  height: Joi.number().positive().allow(null),
  weight: Joi.number().positive().allow(null),
  eyeColor: Joi.string().allow('', null),
  hair: hairSchema.allow(null),
  address: addressSchema.allow(null),
  ip: Joi.string().allow('', null),
  macAddress: Joi.string().allow('', null),
  university: Joi.string().allow('', null),
  bank: bankSchema.allow(null),
  company: companySchema.allow(null),
  ein: Joi.string().allow('', null),
  ssn: Joi.string().allow('', null),
  userAgent: Joi.string().allow('', null),
  crypto: cryptoSchema.allow(null),
  role: Joi.string().required(),
  salary: Joi.number().required()
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(100),
  lastName: Joi.string().min(1).max(100),
  maidenName: Joi.string().allow('', null),
  age: Joi.number().integer().min(0).max(150),
  gender: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  username: Joi.string().min(3).max(50),
  password: Joi.string().min(4).max(50),
  birthDate: Joi.string(),
  image: Joi.string().allow('', null),
  bloodGroup: Joi.string().allow('', null),
  height: Joi.number().positive().allow(null),
  weight: Joi.number().positive().allow(null),
  eyeColor: Joi.string().allow('', null),
  hair: hairSchema.allow(null),
  address: addressSchema.allow(null),
  ip: Joi.string().allow('', null),
  macAddress: Joi.string().allow('', null),
  university: Joi.string().allow('', null),
  bank: bankSchema.allow(null),
  company: companySchema.allow(null),
  ein: Joi.string().allow('', null),
  ssn: Joi.string().allow('', null),
  userAgent: Joi.string().allow('', null),
  crypto: cryptoSchema.allow(null),
  role: Joi.string(),
  salary: Joi.number()
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update'
  });
