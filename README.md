## Petscorts-Next

This is the Next.js front end for [Petscorts.com](httpe://www.petscorts.com).

It's deployed on Vercel. 

The backend API is a Node.js application -- [petscorts-node](https://github.com/asmuts/petscorts-node). It's deployed on AWS Elastic Beanstalk.

Authentication is done via Auht0.

The maps come from both Google and Open Maps. 

Many of the UI components are using react-boostrap.

## Rendering

I'm using a few different rendering strategies as an experiment.

The pet detail page is statically rendered. It's rebuild on demand after 30 seconds.

The search results page is using SWR (stale while refresh).  It will refresh in the bacground when returned to.

The owner admin page is using react hooks. It's generated on the server side on first load.

## Direct API Calls

The front end does not proxy API calls for two reasons: (1) performance and (2) pricing.  

Vercel has hard limits on the number of serverless function that can be deployed.  Each API route is deployed as a serverless function (a separate AWS Lambda instance.)  The sub $5k a month tier only allows for 12!  So direct calls are necessary.

Direct calls from the browser to the Node API server are also faster and less taxing on the front end. Ex. the search auto-complete generates tons of requests and they need to be fast!

## Lambdas - Cold Start

Since this is just a sample application, it suffers from AWS Lambda cold start lag. Once the lambdas are warm, all is well. 



