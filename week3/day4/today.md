#DevOps & CI/CD
1. manual deployment by .jar file
2. CI/CD: continuous integration and continuous delivery/deployment

3. Docker : a platform that allows developers to automate the deployment of applications inside lightweight, portable containers that can run on any system with Docker installed

4. docker vs kubernetes: docker is a containerization platform that allows you to create, deploy, and run applications in containers, while Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications across a cluster of machines. Docker focuses on individual containers, while Kubernetes manages and orchestrates multiple containers across a cluster.

5. kubernates working in simple terms: Kubernetes works by managing a cluster of nodes (machines) that run containerized applications. It uses a master-worker architecture, where the master node controls and manages the worker nodes. The master node schedules and deploys containers on the worker nodes, monitors their health, and handles scaling and load balancing. Kubernetes also provides features like self-healing, automatic rollouts and rollbacks, and service discovery to ensure that applications run smoothly and efficiently in a distributed environment.

6. hpa (horizontal pod autoscaler): a Kubernetes resource that automatically scales the number of pods in a deployment or replica set based on observed CPU utilization or other select metrics. It helps ensure that your application can handle varying levels of traffic and maintain performance by adjusting the number of running pods as needed.

7. vpa (vertical pod autoscaler): a Kubernetes resource that automatically adjusts the resource requests and limits of containers in a pod based on observed resource usage. It helps optimize the performance of your application by ensuring that each container has the appropriate amount of CPU and memory resources allocated, allowing it to handle varying workloads efficiently.

8. hpa vs vpa: HPA (Horizontal Pod Autoscaler) scales the number of pods in a deployment or replica set based on observed metrics, while VPA (Vertical Pod Autoscaler) adjusts the resource requests and limits of containers within a pod based on observed resource usage. HPA focuses on scaling the number of instances, while VPA focuses on optimizing the resources allocated to each instance.  

9. Teraform: an open-source infrastructure as code software tool that allows you to define and provision infrastructure using a high-level configuration language. It enables you to manage and version your infrastructure in a consistent and repeatable way, making it easier to deploy and maintain complex environments across various cloud providers and on-premises data centers.
      ***teraform structure: provider, resource, variable, output, data source, module
      --provider: specifies the cloud provider or service you want to manage (e.g., AWS, Azure, Google Cloud)
      --resource: defines the infrastructure components you want to create or manage (e.g., virtual machines, databases, networking)
      --variable: allows you to parameterize your configuration and make it reusable by defining input variables
        --output: defines the values that you want to output after applying your configuration, which can be used for reference or as input for other configurations

        --data source: allows you to fetch and use data from external sources, such as cloud provider APIs or other Terraform configurations        
        --module: a container for multiple resources that are used together, allowing you to organize and reuse your infrastructure code across different projects or environments

10. Runner: a runner is an agent that runs jobs in a CI/CD pipeline. It can be hosted on various platforms, such as GitHub Actions, GitLab CI/CD, or Jenkins. Runners execute the tasks defined in the pipeline, such as building, testing, and deploying code. They can be configured to run on specific environments or with specific resources, allowing for flexibility and scalability in the CI/CD process.

11. docker run vs docker build: "docker build" is used to create a Docker image from a Dockerfile, which contains instructions on how to build the image. It takes the context of the build (the files and directories) and produces an image that can be run as a container. On the other hand, "docker run" is used to create and start a container from an existing Docker image. It takes the image as input and runs it as a container, allowing you to interact with the application or service defined in the image. In summary, "docker build" is for creating images, while "docker run" is for running containers based on those images.


12. implimented ci/cd via github


CI= automate the -Building and testing of code every time a team member commits changes to version control. This helps to catch bugs early and ensures that the codebase is always in a deployable state.

CD= automate the -deployment of code to production or staging environments after it has passed the CI process. This allows for faster and more reliable releases, as well as easier rollbacks if issues arise. 

continuous delivery vs continuous deployment: Continuous delivery is the practice of automatically preparing code changes for release to production, but requires manual approval before deployment. Continuous deployment, on the other hand, automatically deploys code changes to production without any manual intervention, as long as they pass the automated tests and checks in the CI process.


docker image: a lightweight, standalone, and executable package that includes everything needed to run a piece of software, including the code, runtime, libraries, and system tools. Docker images are used to create containers, which are isolated environments that can run applications consistently across different platforms and environments. Images are built from a Dockerfile, which contains instructions on how to assemble the image, and can be stored in a registry for easy distribution and deployment.   
it is same as class and its object is container. The image is a blueprint for creating containers, while the container is an instance of the image that can be run and interacted with.

dockerhub: a cloud-based registry service that allows you to store, manage, and distribute Docker images. It provides a central repository for Docker images, making it easy to share and collaborate on containerized applications. Docker Hub offers both public and private repositories, allowing users to control access to their images. It also integrates with various CI/CD tools and platforms, enabling seamless deployment of containerized applications.


