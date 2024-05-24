/* eslint-disable no-console */
import { NAVIGATION } from './navigationRef';

type RequestLog = {
  url: URL;
  startTime: number;
  endTime: number;
  currentRoute?: string;
};

function urlWithoutParams(url: URL): string {
  const operationName = url.searchParams.get('operationName');
  const operationNamePart = operationName
    ? `?operationName=${operationName}`
    : '';
  return url.origin + url.pathname + operationNamePart;
}

function visualizeRequestSequence(requestData: RequestLog[]): void {
  if (requestData.length === 0) {
    return;
  }

  // Sort requests by start time
  const sortedRequests = requestData.sort((a, b) => a.startTime - b.startTime);

  // Determine the min and max times for the chart range
  const minTime = Math.min(
    ...sortedRequests.map((request) => request.startTime),
  );
  const maxTime = Math.max(...sortedRequests.map((request) => request.endTime));
  const timeRange = maxTime - minTime;

  // Function to generate a visual representation of a request
  function generateRequestLine(
    request: RequestLog,
    range: number,
    min: number,
  ): string {
    const totalLength = 100; // Total length of the visual representation
    const startOffset = Math.round(
      ((request.startTime - min) / range) * totalLength,
    );
    const endOffset = Math.round(
      ((request.endTime - min) / range) * totalLength,
    );
    const line = ' '.repeat(startOffset) + '|'.repeat(endOffset - startOffset);
    return line;
  }

  // Log the visual representation for each route
  const routes = Array.from(
    new Set(requestData.map((request) => request.currentRoute)),
  );

  console.log('-------- < Request Waterfall Log > --------');
  routes.forEach((route) => {
    console.log(`\nRoute: ${route}`);
    sortedRequests
      .filter((request) => request.currentRoute === route)
      .forEach((request) => {
        const line = generateRequestLine(request, timeRange, minTime);
        console.log(`URL: ${urlWithoutParams(request.url)}`);
        console.log(line);
      });
  });
  console.log('-------- </ Request Waterfall Log > --------');
}

const requestRegistry: RequestLog[] = [];
const urlsToIgnore = [
  'localhost',
];

const ENABLE_DEBUG_REQUEST_WATERFALL = true;
export function debugRequestWaterfallMiddleware(
  fetch: typeof globalThis.fetch,
): typeof globalThis.fetch {
  const fetchLogger = async (url: URL | RequestInfo, options?: RequestInit) => {
    if (
      !ENABLE_DEBUG_REQUEST_WATERFALL ||
      urlsToIgnore.find((urlToIgnore) => url.toString().includes(urlToIgnore))
    ) {
      return fetch(url, options);
    }

    const startTime = Date.now();
    let response;
    try {
      response = await fetch(url, options);
    } finally {
      const endTime = Date.now();
      const isRequestInfo = typeof url === 'object' && 'url' in url;
      requestRegistry.push({
        url: new URL(isRequestInfo ? url.url : url),
        startTime,
        endTime,
        currentRoute: NAVIGATION.ref.current?.getCurrentRoute()?.key || 'root',
      });
    }

    return response;
  };

  setInterval(() => visualizeRequestSequence(requestRegistry), 3000);
  return fetchLogger;
}
