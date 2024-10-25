import { apiKeyState } from "@/atoms/global";
import axios, { AxiosRequestConfig } from "axios";
import { useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";

export const customThrowError = (error: any) => {
  const errorStatus = error?.response?.status || error.status;
  const errorMessage = error?.response?.data?.message || error.message;
  const errObj: any = new Error(error);

  errObj.status = errorStatus;
  errObj.message = errorMessage;

  return errObj;
}

export const blacklistThrowError = (reason: string) => {
  const errorMessage = reason;

  const errObj: any = new Error();
  errObj.status = 403;
  errObj.message = errorMessage;

  return errObj;
}

export const useApi = () => {
  const apiKey = useRecoilValue(apiKeyState);
  const params = useSearchParams();
  const database = params.get('database');

  const api = axios.create({
    headers: {
      'X-Api-Key': apiKey,
      'X-Db-Name': database,
    }
  });

  const apiGet = async (url: string, conf?: AxiosRequestConfig) => {
    const result = await api.get(url, {
      ...conf,
    })
      .then((res: any) => {
        if (res.headers.get('x-is-blacklisted') === 'true') {
          throw blacklistThrowError(res.data.reason);
        }

        return res.data;
      })
      .catch(error => {
        throw customThrowError(error);
      });

    return result;
  }

  const apiPost = async (url: string, data: any) => {
    const result = await api.post(url, data)
      .then((res: any) => {
        if (res.headers.get('x-is-blacklisted') === 'true') {
          throw blacklistThrowError(res.data.reason);
        }
        return res.data;
      })
      .catch(error => {
        throw customThrowError(error);
      })

    return result;
  }

  const apiPut = async (url: string, data: any) => {
    const result = await api.put(url, data)
      .then(res => res.data)
      .catch(error => {
        throw customThrowError(error);
      })

    return result;
  }

  const apiDelete = async (url: string, data?: any) => {
    let result;

    if (data) {
      result = await api.delete(url, { data })
        .then(res => res.data)
        .catch(error => customThrowError(error))
    } else {
      result = await axios.delete(url)
        .then(res => res.data)
        .catch(error => {
          throw customThrowError(error);
        })
    }

    return result;
  }

  return { apiGet, apiPost, apiDelete, apiPut }
}
