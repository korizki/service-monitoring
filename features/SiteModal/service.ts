import { INIT_SERVICE } from "@/store/initial";

export async function getServiceStatus(site: string) {
  try {
    const action = await fetch(`https://api127.${site}/api/health/check`, {
      method: "POST",
    });
    const response = await action.json();
    return response;
  } catch (error) {
    console.error(error);
    return INIT_SERVICE
  }
}

export async function restartService(site: string){
  try {
    const action = await fetch(`https://api127.${site}/api/health/restart`, {
      method: "POST",
    });
    const response = await action.json();
    return response;
  } catch (error) {
    console.error(error);
    return INIT_SERVICE
  }
}