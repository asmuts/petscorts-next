import "next/router";

export function routeToRenterLogin(router, petId, startAt, endAt) {
  const query = { petId, startAt, endAt };
  const url = { pathname: "/api/auth/login-renter-book", query };
  const asUrl = { pathname: "/api/auth/login-renter-book", query };
  router.push(url, asUrl);
}

export function routeToProfile(router) {
  const query = {};
  const url = { pathname: `/profile`, query };
  const asUrl = { pathname: `/profile`, query };
  router.push(url, asUrl);
}

export function routeToPetDetail(router, petId) {
  const query = {};
  const url = { pathname: `/pet/${petId}`, query };
  const asUrl = { pathname: `/pet/${petId}`, query };
  router.push(url, asUrl);
}
