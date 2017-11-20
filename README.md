# NGINX Node SSL Test

Setting up NGINX -> Node w/ SSL on AWS

## Docker container notes

### Creating Dockerfile and Testing Locally
- create simple Dockerfile to COPY in app code and run CMD `npm start`
- `docker build .` to build container image
- `docker run -d -p 80:3000` to run the container and map port 80 on localhost to 3000 in the container
- `docker ps` to get container id and `docker stop <container id>` to stop

### Logging Into ECR From AWS CLI and Pushing Container Image
- `aws ecr get-login --no-include-email --region us-west-2` then run output command to login
- `docker build -t nginx-node-ssl-test .` build and tag
- `docker tag nginx-node-ssl-test:latest <ECR repo>/nginx-node-ssl-test:latest`
- `docker push <ECR repo>/nginx-node-ssl-test:latest`
    - replace `<ECR repo>` with appropriate URI

### ECS Notes for Dummys?
- "tasks" are containers and their config?
- "clusters" are ec2 instances to run "tasks"?
- "services"... not sure yet?
