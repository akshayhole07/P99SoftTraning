1. cloud computing is the delivery of computing services, including servers, storage, databases, networking, software, analytics, and intelligence, over the internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale. Users can access these services on-demand without having to manage physical hardware or software infrastructure.

2. IaaS, PaaS, SaaS3. AWS, Azure, Google Cloud
   a. IaaS: Infrastructure as a Service
   b. PaaS: Platform as a Service   
   c. SaaS: Software as a Service

3. Advantages of cloud computing:
   a. Scalability: Cloud services can easily scale up or down based on demand, allowing businesses to efficiently manage resources and costs.
   b. Cost-effectiveness: Cloud computing eliminates the need for upfront hardware investments and reduces maintenance costs, as users only pay for the resources they consume.
   c. Accessibility: Cloud services can be accessed from anywhere with an internet connection, enabling remote work and collaboration.
   d. Reliability: Cloud providers often have multiple data centers and backup systems in place, ensuring high availability and disaster recovery options.
   e. Security: Many cloud providers invest heavily in security measures to protect data and applications, offering features such as encryption, access controls, and regular security updates.

4. Disadvantages of cloud computing:
   a. Dependency on internet connectivity: Cloud services require a stable internet connection, and any disruptions can affect access to data and applications.
   b. Data privacy and security concerns: Storing sensitive data in the cloud can raise concerns about unauthorized access and data breaches, especially if the cloud provider's security measures are inadequate.
   c. Limited control: Users may have limited control over the underlying infrastructure and may rely on the cloud provider for maintenance and updates, which can lead to potential issues if the provider experiences downtime or changes their services.
   d. Potential for vendor lock-in: Businesses may become dependent on a specific cloud provider's services and tools, making it difficult to switch providers or migrate data without incurring significant costs or disruptions.

5. types of cloud deployment models:
   a. Public cloud: Cloud services are provided by third-party providers and shared among multiple users. Examples include AWS, Azure, and Google Cloud.
   b. Private cloud: Cloud services are dedicated to a single organization and can be hosted on-premises or by a third-party provider. This model offers greater control and security but may require more resources and management.
   c. Hybrid cloud: A combination of public and private cloud services, allowing organizations to leverage the benefits of both models while maintaining flexibility and control over their data and applications.

6. AWS (Amazon Web Services) is a comprehensive cloud computing platform offered by Amazon. It provides a wide range of services, including computing power, storage, databases, machine learning, and analytics. AWS is known for its scalability, reliability, and global reach, making it a popular choice for businesses of all sizes. Some of the key services offered by AWS include:
   a. Amazon EC2 (Elastic Compute Cloud): Provides resizable compute capacity in the cloud, allowing users to run virtual servers.
   b. Amazon S3 (Simple Storage Service): Offers scalable object storage for data backup, archiving, and analytics.
   c. Amazon RDS (Relational Database Service): Provides managed relational databases, making it easier to set up, operate, and scale databases in the cloud.
   d. AWS Lambda: Allows users to run code without provisioning or managing servers, enabling serverless computing.
   e. Amazon VPC (Virtual Private Cloud): Enables users to create isolated networks within the AWS cloud for enhanced security and control over resources.
   f. 26 regions and 84 availability zones worldwide, providing global coverage and redundancy for applications and data.

7. Availability zones (AZs) are isolated locations within a cloud provider's data center infrastructure. Each AZ is designed to be independent and fault-tolerant, with its own power, cooling, and networking. This allows for high availability and disaster recovery options, as applications and data can be replicated across multiple AZs to ensure continuity in case of failures or outages. By distributing resources across different AZs, businesses can improve the resilience and performance of their applications while minimizing the risk of downtime.

8. aws services 
    a. Compute: Amazon EC2, AWS Lambda, Amazon ECS (Elastic Container Service), Amazon EKS (Elastic Kubernetes Service)
    b. Storage: Amazon S3, Amazon EBS (Elastic Block Store), Amazon Glacier
    c. Databases: Amazon RDS, Amazon DynamoDB, Amazon Aurora
    d. Networking: Amazon VPC, AWS Direct Connect, Amazon Route 53
    e. Analytics: Amazon Redshift, Amazon EMR (Elastic MapReduce), Amazon Kinesis
    f. Machine Learning: Amazon SageMaker, AWS Deep Learning AMIs, Amazon Rekognition
    g. Security: AWS Identity and Access Management (IAM), AWS Key Management Service (KMS), AWS Shield
    h. Management and Monitoring: AWS CloudWatch, AWS CloudTrail, AWS Config
    i. Developer Tools: AWS CodeCommit, AWS CodeBuild, AWS CodeDeploy, AWS CodePipeline
    j. Internet of Things (IoT): AWS IoT Core, AWS IoT Analytics
    k. Migration and Transfer: AWS Migration Hub, AWS Database Migration Service, AWS Snowball
    l. Mobile Services: AWS Amplify, AWS AppSync, AWS Device Farm
    m. Application Integration: AWS Step Functions, Amazon SQS (Simple Queue Service), Amazon SNS (Simple Notification Service)
    n. Business Applications: Amazon WorkSpaces, Amazon Chime, Amazon Connect
    o. Developer Tools: AWS Cloud9, AWS X-Ray, AWS CodeStar

9. AWS VPC (Virtual Private Cloud) is a service that allows users to create a logically isolated section of the AWS cloud where they can launch AWS resources in a virtual network that they define. With VPC, users have complete control over their virtual networking environment, including the selection of IP address ranges, creation of subnets, and configuration of route tables and network gateways. This enables users to securely connect their AWS resources to the internet or to their on-premises data centers, while also providing options for private connectivity and enhanced security through features like security groups and network access control lists (ACLs). VPC is a fundamental building block for deploying applications and services in the AWS cloud, offering flexibility, scalability, and security for a wide range of use cases.

10. by default ec2 has own vpc and subnet, but we can create our own vpc and subnet to have more control over our network configuration. This allows us to customize our network settings, such as IP address ranges, routing tables, and security groups, to better suit our specific application requirements and security needs. By creating our own VPC and subnet, we can also isolate our resources from other users and have greater control over the traffic flow within our network. Additionally, using our own VPC and subnet can help improve security by allowing us to implement specific access controls and network segmentation, reducing the risk of unauthorized access to our resources. Overall, creating our own VPC and subnet provides us with greater flexibility, control, and security for our AWS resources.

11. public ip and private ip
    a. Public IP: A public IP address is an IP address that is accessible from the internet. It is assigned to resources that need to communicate with external networks or users. Public IP addresses are unique across the entire internet and can be used to identify and access resources from anywhere in the world.
    b. Private IP: A private IP address is an IP address that is used within a private network and is not accessible from the internet. Private IP addresses are typically used for internal communication between resources within a VPC or subnet. They are not unique across the internet and can be reused in different private networks without causing conflicts. Private IP addresses are often used for resources that do not require direct access from the internet, such as databases or application servers, to enhance security and reduce exposure to potential threats.

12. class A Ip address range:
    a. Class A IP addresses range from 1.0.0.0 to 126.255.255.254
       The default subnet mask for Class A is 255.0.0.0
    b. Class B IP addresses range from 128.0.0.0 to 191.255.255.254
       The default subnet mask for Class B is 255.255.0.0
    c. Class C IP addresses range from 192.0.0.0 to 223.255.255.254
       The default subnet mask for Class C is 255.255.255.0
    d. Class D IP addresses range from 224.0.0.0 to 239.255.255.254
       Class D is reserved for multicast groups and does not have a default subnet mask.
       reserved for multicast groups and does not have a default subnet mask.
    e. Class E IP addresses range from 240.0.0.0 to 255.255.255.254
       Class E is reserved for experimental use and does not have a default subnet mask.

13. CIDR (Classless Inter-Domain Routing) is a method for allocating IP addresses and routing internet traffic. It allows for more efficient use of IP address space by enabling variable-length subnet masking (VLSM). CIDR notation is used to specify IP address ranges and their associated subnet masks. For example, an IP address with a CIDR notation of 192.168.1.0/24 indicates an IP address range with a subnet mask of 255.255.255.0. The "/24" indicates that the first 24 bits of the IP address are used for the network portion, leaving the remaining 8 bits for host addresses. CIDR allows for more flexible and efficient allocation of IP addresses, as it can accommodate networks of varying sizes without being limited to the traditional class-based addressing system. This helps to reduce the wastage of IP addresses and allows for better management of network resources.

14. 5 ip is reserved for network and broadcast addresses in each subnet. The first IP address in a subnet is reserved for the network address, which identifies the subnet itself, while the last IP address is reserved for the broadcast address, which is used to send messages to all hosts within the subnet. Therefore, when calculating the number of usable IP addresses in a subnet, you need to subtract these 2 reserved addresses from the total number of IP addresses available in that subnet. For example, if a subnet has a total of 256 IP addresses (such as in a /24 subnet), you would have 254 usable IP addresses for hosts, as 2 are reserved for the network and broadcast addresses.

15. Subnetting is the process of dividing a larger network into smaller, more manageable sub-networks (subnets). This allows for better organization, improved security, and more efficient use of IP address space. Subnetting involves taking a portion of the host bits from an IP address and using them to create additional network bits, which can be used to define multiple subnets within a larger network. By subnetting, you can create separate subnets for different departments, teams, or applications, allowing for better control over network traffic and improved security by isolating resources. Additionally, subnetting can help to reduce network congestion and improve performance by limiting the number of hosts in each subnet. Overall, subnetting is an essential technique for managing and optimizing network resources in both small and large-scale environments.
   - private subnet: A private subnet is a subnet that is not directly accessible from the internet. Resources within a private subnet can communicate with each other and with resources in other subnets, but they cannot be accessed from outside the VPC without the use of a NAT gateway or other routing mechanisms. Private subnets are often used for resources that do not require direct internet access, such as databases or application servers, to enhance security and reduce exposure to potential threats.
   - public subnet: A public subnet is a subnet that is directly accessible from the internet. Resources within a public subnet can communicate with the internet and can be accessed from outside the VPC. Public subnets are typically used for resources that require direct internet access, such as web servers or load balancers, to allow users to interact with them over the internet. Public subnets often have an associated internet gateway to facilitate communication with the internet.

   - for what private subnet is used: Private subnets are used for resources that do not require direct internet access, such as databases, application servers, or internal services. By placing these resources in a private subnet, you can enhance security by isolating them from the public internet and reducing the attack surface. Resources in a private subnet can still communicate with each other and with resources in other subnets, but they cannot be accessed from outside the VPC without the use of a NAT gateway or other routing mechanisms. This allows you to protect sensitive data and applications while still enabling necessary communication within your network.

   - NAT: A NAT (Network Address Translation) gateway is a service that allows resources in a private subnet to access the internet while preventing inbound traffic from the internet from directly reaching those resources. A NAT gateway translates the private IP addresses of resources in the private subnet to a public IP address when they communicate with the internet, and it also handles the return traffic from the internet back to the private subnet. This allows resources in the private subnet to access external services, such as software updates or APIs, without exposing them to direct internet access, thereby enhancing security while still enabling necessary communication with the outside world.


**very very important to: create public and private subnet and connect them to the internet using internet gateway and nat gateway.
  create vpc -> internet gateway -> rout table -> subnet association -> add public vpc -> rout table -> select new created route table -> go to routes -> edit routes -> add route 
  and 
  create nat gateway -> add private route table -> select subnet mask-> go to routes -> edit routes -> add route -> select nat gateway  

 -- components used in vpc :
    a. VPC (Virtual Private Cloud): A logically isolated section of the AWS cloud where you can launch AWS resources in a virtual network that you define.
    b. Subnet: A range of IP addresses in your VPC that can be used to launch resources. Subnets can be public or private, depending on whether they have direct access to the internet.
    c. Internet Gateway: A horizontally scaled, redundant, and highly available VPC component that allows communication between instances in your VPC and the internet.
    d. NAT Gateway: A managed service that enables instances in a private subnet to connect to the internet or other AWS services while preventing inbound traffic from the internet from directly reaching those instances.
    e. Route Table: A set of rules, called routes, that are used to determine where network traffic is directed within your VPC. Each subnet must be associated with a route table, which controls the routing for that subnet.



15. OS 
    -Windows: Windows is a popular operating system developed by Microsoft. It is known for its user-friendly interface, wide range of software compatibility, and extensive support for gaming and multimedia applications. Windows is commonly used in personal computers, laptops, and enterprise environments.
    -Unix: Unix is a powerful and versatile operating system that has been widely used in server environments and academic settings. It is known for its stability, security, and multitasking capabilities. Unix provides a command-line interface and supports a wide range of programming languages and tools, making it popular among developers and system administrators.
    -Linux: Linux is an open-source operating system that is based on the Unix architecture. It is known for its stability, security, and flexibility. Linux is widely used in server environments, cloud computing, and embedded systems. It offers a variety of distributions (distros) such as Ubuntu, CentOS, and Debian, each with its own features and target audience. Linux provides a command-line interface as well as graphical user interfaces (GUIs) for ease of use.
    -Amazone Linux: Amazon Linux is a Linux-based operating system developed by Amazon Web Services (AWS) specifically for use in the AWS cloud environment. It is designed to provide a secure, stable, and high-performance platform for running applications on AWS. Amazon Linux is optimized for AWS services and includes features such as enhanced security, performance improvements, and integration with AWS tools and services. It is available in two versions: Amazon Linux 2, which is a long-term support (LTS) release, and Amazon Linux AMI, which is a legacy version that is no longer actively maintained. Amazon Linux is commonly used for running web servers, application servers, and other workloads in the AWS cloud.

    linux file system heirarchy:
    - /
    -/root
    -/home
    -/boot
    -/etc
    -/usr directory
    -/bin
    -/sbin



    --Linux commands:
     -whoami: Displays the current user.
     -pwd (Print Working Directory): Shows the current directory path.\
     -ls: Lists the files and directories in the current directory.
     -sudo su -: Switches to the root user with a login shell, allowing you to execute commands with root privileges.
     -cd: Changes the current directory to the specified directory.
     -cat: Concatenates and displays the contents of a file.
     -nano: A simple text editor used to create and edit files in the terminal.
     
16. EC2 (Elastic Compute Cloud) is a web service provided by Amazon Web Services (AWS) that allows users to rent virtual servers, known as instances, to run applications and workloads in the cloud. EC2 provides scalable computing capacity, allowing users to quickly and easily launch and manage virtual machines with various configurations of CPU, memory, storage, and networking resources. EC2 instances can be used for a wide range of applications, including web hosting, data processing, machine learning, and more. Users can choose from a variety of instance types optimized for different use cases and can also take advantage of features such as auto-scaling, load balancing, and security groups to manage their EC2 resources effectively. Overall, EC2 provides a flexible and cost-effective solution for running applications in the cloud without the need for physical hardware management.


--> launch EC2 instance :
   open putty 
   local ip from ec2 
   go ssh->auth-> credentials-> browse-> select .ppk file : result :login as -> hit ec2-user 
   stop instance