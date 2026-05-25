1. linux command on ec2 instance
 yum install tree
 cp file1 file2: means copy file1 to file2 
 mv file1 file2 : means move file1 to file2, if file2 already exists, it will be overwritten
 rm file1 : means remove file1

 which httpd : means find the location of httpd command
 install jenkins : 
    sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
    what is jenkins: jenkins is a open source automation server which enables developers around the world to reliably build, test, and deploy their software. It is a self-contained java-based program that can be run on various platforms, including Windows, macOS, and Linux. Jenkins provides a wide range of plugins that allow users to integrate with various tools and technologies, making it a popular choice for continuous integration and continuous delivery (CI/CD) pipelines. With Jenkins, developers can automate the process of building, testing, and deploying their applications, which helps to improve efficiency and reduce errors in the software development lifecycle.

 
  sudo yum install httpd
  service httpd start
  run apache tomcat server:
    1. download apache tomcat server from the official website: command: wget https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.68/bin/apache-tomcat-9.0.68.tar.gz
    2. extract the downloaded file using the command: tar -xvf apache-tomcat-9.0.68.tar.gz
    3. navigate to the bin directory of the extracted folder using the command: cd apache-tomcat-9.0.68/bin
    4. run the startup.sh script to start the server using the command: ./startup.sh


   -gpassward -m user1,user2,user3 : means create a group named gpassward and add users user1, user2, and user3 to the group. The -g option specifies the group name, the -m option creates a home directory for each user, and the list of users is provided after the options. This command is typically used in Linux or Unix-based systems to manage user accounts and groups.


     
    yum install hpptd -y: means install the httpd package using the yum package manager with the -y option, which automatically answers "yes" to any prompts during the installation process. This command is typically used in Linux-based systems to install the Apache HTTP Server, which is a widely used web server software.

    yum install git -y: means install the git package using the yum package manager with the -y option, which automatically answers "yes" to any prompts during the installation process. This command is typically used in Linux-based systems to install Git, which is a distributed version control system commonly used for source code management in software development.


    
    edit inbound rule-> http and 0.0.0.0 

    EC2 Web Server Setup & Deployment

1. ssh -i training-key ec2-user@<public-ip>
   → Access AWS server

2. sudo su -
   → Get admin privileges

3. yum install httpd -y
   → Install Apache web server

4. cd /var/www/html
   → Go to web root directory

5. which git
   → Check if Git is installed

6. yum install git -y
   → Install Git

7. which git
   → Verify Git installation

8. git clone https://github.com/ARAVINDTrainings/FoodApp.git
   → Clone project from GitHub

9. cd FoodApp
   → Open project folder


10. ls
     

    Memory: Connect → Root → Apache → Web Folder → Git → Clone → Open → Check



    http://<public-ip> : Access the web server using the public IP address of the EC2 instance. You should see the contents of the index.html file from the FoodApp project displayed in your web browser.

    ***move that 4 files into html direclty and then it works fine. because the index.html file is in the FoodApp folder, so we need to move it to the html directory to make it work. 
    **go in FoodApp and use this command : mv * ../ to copy all files from the FoodApp folder to the html directory. .
    systemctl start httpd
    systemctl enable httpd


2. Attach and detach EBS volume to EC2 instance
   --different availability zone instance and volume can not be attached, so we need to create a new volume in the same availability zone as the instance.
   --change th zone of the ebs : 
      1. create a snapshot of the existing volume: how to create a snapshot: go to the EC2 dashboard, click on "Elastic Block Store" in the left-hand menu, then click on "Volumes". Find the volume you want to create a snapshot of, select it, and click on the "Actions" button. From the dropdown menu, select "Create Snapshot". Fill in the required information and click "Create Snapshot" to start the process.

3. ELB (Elastic Load Balancer)
   --ELB is a service that automatically distributes incoming application traffic across multiple targets, such as EC2 instances, containers, and IP addresses. It helps to improve the availability and scalability of applications by distributing traffic evenly across multiple targets and automatically scaling up or down based on demand. ELB supports different types of load balancers, including Application Load Balancer, Network Load Balancer, and Classic Load Balancer, each designed for specific use cases and traffic patterns. With ELB, you can ensure that your applications are highly available and can handle varying levels of traffic without any downtime or performance issues.

   a.Application Load Balancer: It operates at the application layer (Layer 7) and is designed to handle HTTP and HTTPS traffic. It provides advanced routing capabilities, such as path-based routing and host-based routing, allowing you to route traffic to different targets based on the content of the request.
   
   b.Network Load Balancer: It operates at the transport layer (Layer 4) and is designed to handle TCP traffic. It provides high performance and low latency, making it suitable for applications that require extreme performance, such as gaming or real-time streaming.

   c.Classic Load Balancer: It operates at both the application layer (Layer 7) and the transport layer (Layer 4) and is designed to handle both HTTP/HTTPS and TCP traffic. It provides basic load balancing capabilities and is suitable for applications that do not require advanced routing features.
    
    
we implemented classic load balancer 

4. snowball
   --snowball is a data transfer service that helps you securely transfer large amounts of data into and out of the AWS cloud. It is designed to handle data transfer at scale, allowing you to move petabytes of data quickly and securely. Snowball uses a physical device, called a Snowball Edge, which is shipped to your location. You can then connect the device to your local network and transfer your data onto it. Once the transfer is complete, you can ship the device back to AWS, where the data will be uploaded to your S3 bucket or other AWS storage service. Snowball provides a secure and efficient way to transfer large amounts of data, especially when network bandwidth is limited or when you need to transfer data from remote locations.

5. sns
   --SNS (Simple Notification Service) is a fully managed messaging service provided by AWS that allows you to send messages or notifications to a large number of subscribers or endpoints. It provides a simple and flexible way to send messages to various types of endpoints, such as email, SMS, mobile push notifications, and HTTP/S endpoints. With SNS, you can create topics to which subscribers can subscribe, and then publish messages to those topics. SNS also supports message filtering, allowing you to send messages only to specific subscribers based on certain criteria. It is commonly used for sending alerts, notifications, and updates in various applications and systems.

   --we created created topic for email
    -- and publish msg to subscribers 
    --setting alarms using cloudewatch 
    -- 


#conclusion -> list todays all topics :
1. Linux commands on EC2 instance:
   - yum install tree
   - cp file1 file2
   - mv file1 file2
   - rm file1
   - which httpd
   - install jenkins
   - sudo yum install httpd
   - service httpd start
   - run apache tomcat server
   - user and group management commands
2. EC2 Web Server Setup & Deployment
3. Attach and detach EBS volume to EC2 instance
4. ELB (Elastic Load Balancer)  
5. Snowball: A data transfer service for securely transferring large amounts of data into and out of the AWS cloud.
6. SNS (Simple Notification Service): A fully managed messaging service that allows you to send messages or notifications to a large number of subscribers or endpoints.
