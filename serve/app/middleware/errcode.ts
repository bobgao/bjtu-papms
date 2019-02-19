import { Context } from 'egg';
import { ValidationError, ValidationErrorItem } from 'sequelize';
import errcode, { ErrorMessage, ValidationMessage, BaseError } from '../errcode';

const FormatValidationError = (errors: ValidationErrorItem[]): ErrorMessage => {
  const message = errors
    .map(item => {
      try {
        const format =
          ValidationMessage[item.validatorName] || ((v: string, k: string) => `${k}: ${v}`);
        const value = item.value.toString();
        return format(value.length > 10 ? `${value.slice(0, 7)}...` : value, item.validatorKey);
      } catch {}
    })
    .filter(item => item)
    .join('\n');
  return {
    errcode: errcode.ValidationError.errcode,
    errmsg: `${errcode.ValidationError.errmsg}\n${message}`,
  };
};

export default (): any => {
  return async function gzip(ctx: Context, next: () => Promise<any>) {
    try {
      await next();
      if (!Array.isArray(ctx.body) && typeof ctx.body === 'object') {
        ctx.body = { ...errcode.Success, ...ctx.body } as ErrorMessage;
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        const { errors } = err as ValidationError;
        ctx.body = FormatValidationError(errors);
      } else if (err instanceof BaseError) {
        ctx.body = { ...errcode[err.type], errmsg: err.message } as ErrorMessage;
      } else {
        ctx.body = { ...errcode.SystemBusy };
      }
    }
  };
};
