import Joi from "joi";

export const createShortUrlSchema = Joi.object({
  longUrl: Joi.string().uri().required(),
  customAlias: Joi.string().alphanum().length(7).optional(),
  topic: Joi.string().optional(),
});

export const shortCodeSchema = Joi.object({
  shortCode: Joi.string().pattern(new RegExp("^[0-9a-zA-Z]{7}$")).required(),
});
