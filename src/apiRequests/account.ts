import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accountApiRequest = {
  getMe() {
    return http.get<AccountResType>("/accounts/me");
  },
} as const;

export default accountApiRequest;
