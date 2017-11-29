# NGINX Node SSL Test

Setting up NGINX -> Node w/ SSL on AWS

## Docker container notes

### Creating Dockerfile and Testing Locally
- create simple Dockerfile to COPY in app code and run CMD `npm start`
- `docker build .` to build container image
- `docker run -d -p 80:3000` to run the container and map port 80 on localhost to 3000 in the container
- `docker ps` to get container id and `docker stop <container id>` to stop

## AWS Notes

### Connect to EC2 via ssh
- click "Connect" button in EC2 console for help

### Set up NGINX on EC2
- https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
- `ufw` steps not needed (the firewall is already disabled)
- added HTTP inbound rule to security group for EC2 instance

### Install Docker on EC2
- https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#upgrade-docker-ce
- all docker commands ran with `sudo` going forward

### Run node app container in EC2 instance
- In AWS ECR create new container registry for the the node app container
- `docker login` in EC2 using the same command that was used to login to the repo locally and push the image
- `docker pull` in EC2 from repo
- `sudo docker run -d -p 3000:3000 <IMAGE>` to run app on port 3000

### Setup NGINX reverse proxy
- remove `/etc/nginx/sites-enabled/default` (symlinked file)
- add new `*.conf` file to `/etc/nginx/sites-available` then symlink to `sites-enabled`
    - ```
    server {
        listen 80 default_server;

        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```
- restart nginx

### Setup subdomain
- add subdomain in Route 53 to domain with nameservers already configured properly
    - given an ip value of the public ip for the EC2 instance
- update nginx configured
    - ```
    server {
        listen 80;
        server_name ssl-test.baclap.com;

        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    server {
        listen 80 default_server;
        server_name _; # wildcard domain
        return 444; # "go away"
    }
    ```

### Setup SSL
- https://www.digitalocean.com/community/tutorials/how-to-set-up-let-s-encrypt-with-nginx-server-blocks-on-ubuntu-16-04
- install certbot
- ensure https is allowed in AWS security group
- wow this is super easy

### Setup CloudWatch Logs
- https://docs.docker.com/engine/admin/logging/awslogs/
- https://wdullaer.com/blog/2016/02/28/pass-credentials-to-the-awslogs-docker-logging-driver-on-ubuntu/
- TLDR: run the node app docker container using the `awslogs` log driver
- first setup the log group and then the log stream within that group in the AWS CloudWatch Logs console
- create IAM Role with `CloudWatchLogsFullAccess` policy and attach role to EC2 instance
- to run container:
    - ```
    sudo docker run --log-driver="awslogs" \
                    --log-opt awslogs-region="<REGION>" \
                    --log-opt awslogs-group="<GROUP>" \
                    --log-opt awslogs-stream="<STREAM>" \
                    -d \
                    -p 3000:3000 \
                    <IMAGE>
    ```
