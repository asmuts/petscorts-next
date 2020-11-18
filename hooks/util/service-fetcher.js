// expects { somedataname, err } from the services
//
// This is designed to make it easier to wrap a service method
// to be used in an SWR hook.
export async function fetch(method, ...args) {
  const result = await method(...args);
  if (!result) {
    throw new Error("Nothing returned from fetch!");
  }
  //console.log(result);
  if (result.err) {
    throw new Error(result.err);
  }
  return result;
}
