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
