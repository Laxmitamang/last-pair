import "server-only";

export function hasAdminRole(role: string | null | undefined) {
  return role?.split(",").map((value) => value.trim()).includes("admin") ?? false;
}
