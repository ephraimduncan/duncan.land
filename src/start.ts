import { createMiddleware, createStart } from "@tanstack/react-start";

const canonicalHost = "ephraimduncan.com";
const redirectHosts = ["www.ephraimduncan.com", "duncan.land", "www.duncan.land"];

const canonicalDomainMiddleware = createMiddleware().server(({ request, next }) => {
  const url = new URL(request.url);

  if (redirectHosts.includes(url.hostname)) {
    url.protocol = "https:";
    url.hostname = canonicalHost;
    return Response.redirect(url.toString(), 308);
  }

  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [canonicalDomainMiddleware],
}));
