import { get } from "../useApiCallGit/TsVersion/AxiosInterceptor/network";
import { CustomAxios } from "../useApiCallGit/TsVersion/axios.schema";

interface Params {
  pageNumber: number;
}

interface userData {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  }[];
}

export const getUserData = ({ pageNumber }: Params): CustomAxios<userData> => {
  return get("https://reqres.in/api/users/", { page: pageNumber });
};
