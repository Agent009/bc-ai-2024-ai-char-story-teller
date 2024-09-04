import { constants } from "@lib/index";

/**
 * Get the formatted API URL for the given endpoint, replacing any placeholders with the respective parameters.
 * @param {string} endpoint
 * @param {null|undefined|{[]}} params
 * @returns {string}
 */
export const getApiUrl = (endpoint: string, params?: { [key: string]: never }): string => {
  let apiUrl = constants.routes.api.base;
  apiUrl += (apiUrl?.charAt(apiUrl?.length - 1) !== "/" && endpoint?.charAt(0) !== "/" ? "/" : "") + endpoint;
  // console.log(apiUrl);

  const placeholderIdToken = "/:";
  const urlPlaceholders: string[] = apiUrl.split(placeholderIdToken);
  const usedParamKeys: string[] = [];

  if (urlPlaceholders.length >= 2) {
    urlPlaceholders.shift();

    urlPlaceholders.forEach((placeholder) => {
      const placeholderKey = placeholder.split("/")[0];
      usedParamKeys.push(placeholderKey);
      const paramValue = params?.[placeholderKey];
      apiUrl = apiUrl.replace(placeholderIdToken + placeholderKey, "/" + paramValue);
    });
  }

  if (params) {
    const remainingParamKeys = Object.keys(params).filter((paramKey) => !usedParamKeys.includes(paramKey));

    remainingParamKeys?.forEach((paramKey, index) => {
      const paramValue = params?.[paramKey];
      apiUrl += index === 0 ? "?" : "&";
      apiUrl += `${paramKey}=${paramValue}`;
    });
  }
  return apiUrl;
};
