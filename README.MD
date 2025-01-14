# Crowd Funding Project

## How to Run

### Step 1: Start the Backend
1. Open a terminal and navigate to the Backend folder:
   ```bash
   cd Backend
   ```
2. Build and run the application:
   ```bash
   ./mvnw clean package
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

   On Windows:
   ```bash
   mvnw.cmd clean package
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

### Step 2: Start the Frontend
1. Open a new terminal and navigate to the Frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies and run the application:
   ```bash
   npm install
   npm start
   ```

### Default URLs
- **Backend**: `http://localhost:8080`
- **Frontend**: `http://localhost:3000`

---

Ensure both the backend and frontend are running simultaneously for full functionality.