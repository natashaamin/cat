
export const ApiErrorHandler = (
  e: any,
  isAuthService?: boolean
) => {

  console.log("ApiErrorHandler: ", JSON.stringify(e), isAuthService);
  if (
    e.status &&
    e.status === 401 &&
    isAuthService != undefined &&
    !isAuthService
  ) {
    try {
      console.warn("Oh look, an alert!");
    } catch (e) {
      console.warn("Session expired. Please log in again");
    }
  } else if (e === "Request timeout" || e === "Network request failed") {
    console.warn(`${e}. Please try again`);
  } else {
    console.warn("Something went wrong. Please try again");
  }
};
