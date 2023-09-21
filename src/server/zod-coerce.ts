import type { z } from 'zod';

export const zodCoerce = (value: any, schema: z.ZodTypeAny): any => {
  const typeName = schema._def.typeName;
  if (typeName === 'ZodString') return String(value);
  if (typeName === 'ZodNumber') return Number(value);
  if (typeName === 'ZodBoolean') return Boolean(value);
  if (typeName === 'ZodDate') return new Date(value);
  if (typeName === 'ZodArray') {
    const array = Array.isArray(value) ? value : [value];
    return array.map((item) => zodCoerce(item, schema._def.type));
  }
  if (typeName === 'ZodObject') {
    const object = typeof value === 'object' && value != null ? value : {};
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, zodCoerce(value, schema._def.type)]));
  }
  return value;
};
