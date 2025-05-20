import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./customErrorReporter";

vine.errorReporter = () => new CustomErrorReporter();

export const summarySchema = vine.object({
  url: vine.string().url(),
  userId: vine.string(),
});
