export type APIHandler = (ctx: {
  request: Request;
  params?: Record<string, string>;
}) => Promise<Response> | Response;

export type APIMethods = {
  GET?: APIHandler;
  POST?: APIHandler;
  PUT?: APIHandler;
  DELETE?: APIHandler;
  PATCH?: APIHandler;
  OPTIONS?: APIHandler;
};

export interface APIFileRoute {
  path: string;
  handlers: APIMethods;
}

export function createAPIFileRoute(path: string) {
  return (handlers: APIMethods): APIFileRoute => ({
    path,
    handlers,
  });
}
