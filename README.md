# ShoeShop - E-Commerce Platform

ShoeShop is a full-stack e-commerce application designed to provide a seamless shopping experience for footwear. The project features a robust backend built with Spring Boot and a modern frontend using Next.js.

## Key Features & Achievements

Based on the actual project implementation, here are the technical highlights:

* **Authentication & Authorization**: Implemented secure authentication and authorization workflows using **JWT** and **Spring Security**, effectively preventing unauthorized API access via stateless session management and role-based access control (Admin/Customer).
* **Performance Optimization**: Developed core e-commerce backend modules, integrating **Redis Caching** for product listings (`getAllProducts`, `getProductById`). This significantly reduces database query load and improves API response times for catalog browsing.
* **AI Chatbot Integration**: Integrated the **OpenAI API (GPT-3.5-Turbo)** to build an AI Assistant. The chatbot successfully automates customer support, helps users discover products based on their preferences (size, color, budget), and guides them through the purchasing flow.
* **Infrastructure & Deployment**: Containerized the application using **Docker** and **Docker Compose**, orchestrating multiple services including the Spring Boot backend, Next.js frontend, MariaDB database, Redis cache, and an Nginx reverse proxy. The application also integrates with **AWS S3** for scalable cloud storage.

## Tech Stack

### Backend
* **Framework**: Spring Boot (Java 21)
* **Database**: MariaDB (SQL), Spring Data JPA
* **Caching**: Redis
* **Security**: Spring Security, JWT
* **AI/LLM**: OpenAI API
* **Cloud Storage**: AWS S3 SDK
* **Build Tool**: Maven

### Frontend
* **Framework**: Next.js 16, React 19
* **Styling**: Tailwind CSS, Shadcn UI
* **Language**: TypeScript

## Getting Started

### Prerequisites
* Docker and Docker Compose
* Java 21 (if running backend manually)
* Node.js 20+ (if running frontend manually)

### Running with Docker
1. Clone the repository.
2. Navigate to the `backend` directory.
3. Configure the `.env` file with your database credentials, OpenAI API key, and AWS S3 credentials.
4. Run the following command to start all services:
   ```bash
   docker-compose up -d --build
   ```
5. The application will be accessible via the Nginx reverse proxy on port 80.

### Running Locally
**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Testing
The backend includes unit tests to verify the core logic, such as caching performance and authentication flow. To run the tests:
```bash
cd backend
./mvnw test
```
