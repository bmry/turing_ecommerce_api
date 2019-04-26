# TURING E-ECOMMERCE BACKEND
This is the backend of Turing's E-commerce System which ultimately allows users to the following

   - *Search Item*

- *Add Item To Shopping Cart*

-  *Create Order*

-  *Checkout*

- *Make Payment*

**DOCUMENTATION: https://documenter.getpostman.com/view/3466097/S1ENyJvT**


**HOW TO INSTALL**
   
   -    Install Dependency
    
    yarn
    
  - Provide enviroment variable such as Database Host e.t.c in .env file you will find in the root directory.
  
  - Start application
    
   
     Run "yarn start"   
    
 


**ARCHITECTURE**

This application design has modeled the Microservice Architectural Style, therefore has been decomposed  into individual service
services that can be independently maintained, deployed and scale when the need arises.

**SERVICES**

This application is made up of collection of services that work together.

- Customer Service

-  Order Service

-  Payment Service

-  Product Service



**TECHNOLOGIES**

1. **AWS EC2**

2. **NodeJS:** Node.js is an open-source, cross-platform JavaScript run-time for writing javascript server side applications.

3. **ExressJS:** This is the web application framework for Node.js

4.  **AWS MYSQL INSTANCE**: This is an open source relational database management system.

4.  **New Relic:** This is an APM (Application Performance Monitor) which helps to gets real-time insights that a software needs to perform faster and scale.

5.  **Winston:** A logger for just about everything.

6.  **Helmet:** It helps to secure Express apps with various HTTP headers.

7.   **Rate limit:** Used to limit repeated requests to public APIs and/or endpoints such as password reset.



**SUPPORT FOR 1,000,000 ACTIVE USERS**

This application has been built as a collection services so that they can independenly deployed, maintained and scaled.
Each of these services would be dockerised and each service deployed per container in a cloud infracstructure such as AWS ECS.

To ensure High Availability of the services minimum of 2 instances of would be up at a given time so that
when one service is down the other would able to service customer request while the container orchestration system spin a new instance to fulfil the
autoscaling contract of minimum of 2 services at a given time.
 
This Application has been deployed on **AWS EC2 INSTANCE** with **AUTOSCALING SETTINGS** combined with **AWS ELASTIC LOADBALANCER**  so that service instances
can easily scale up and down depending number traffic hitting the services so that users request can be effeciently handled without delay.
**Load Balancers** ensures that request evenly distributed among service instances which is the reason why AWS LOAD Balancer has been choosen for this purpose.

The Application Database has also been deployed on **AWS RDS INSTANCE** for the purpose of  Data Security, Data Storage Autoscaling,
Backup and Autoscaling.



**SUPPORT FOR 50% AMERICAN ACTIVE USERS**

I will deploy more instance of the API services in the American Region and using the **AWS ROUTE53** Geolocation Routing Policy,American users routed to the services in that region.
