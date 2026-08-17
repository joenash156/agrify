# Agrify — Setup & Run Guide

This guide is written for someone who has **never used Spring Boot or React
before**. Follow it top to bottom and you'll have the app running on your
own computer. It covers getting the code two ways — cloning with Git, or
downloading a ZIP — so pick whichever applies to you.

Agrify has three moving parts, and you need all three running:

1. **MySQL** — the database that stores all the data
2. **Backend** — a Java/Spring Boot server (runs on `http://localhost:8080`)
3. **Frontend** — a React web app (runs on `http://localhost:5173`)

---

## Prerequisites — install these first

Install these four things before doing anything else. For each one, run the
"verify" command in a terminal (Command Prompt, PowerShell, or Terminal) to
confirm it worked before moving to the next.

### 1. Git — *only needed if you're cloning from GitHub, skip if using the ZIP*
- Download: https://git-scm.com/downloads
- Verify: `git --version` should print a version number.

### 2. Java Development Kit (JDK) 25
This project needs **exactly JDK 25 or newer** — an older Java (like 17 or
21) will not compile it.
- Download: https://adoptium.net (choose version 25, "JDK", your OS)
- Verify: `java -version` should print something starting with `25`.

### 3. Node.js (version 20 or newer, includes npm)
- Download: https://nodejs.org (pick the LTS version, which is 20+ as of
  this writing)
- Verify: `node -v` and `npm -v` should both print version numbers.

### 4. MySQL Server 8.0
- Download: https://dev.mysql.com/downloads/mysql/ (pick "MySQL Installer"
  on Windows, or the relevant package for macOS/Linux)
- During installation, you'll be asked to set a **root password** — write
  it down, you'll need it in Step 2 below.
- Also install **MySQL Workbench** if it isn't bundled already — it gives
  you a visual way to run the setup script (Download:
  https://dev.mysql.com/downloads/workbench/). You *can* do everything from
  the command line instead if you prefer; both paths are shown below.
- Verify: open MySQL Workbench and connect to your local server (usually
  `127.0.0.1`, port `3306`, user `root`, the password you set) — if it
  connects, you're good.

A regular code editor (VS Code, IntelliJ, etc.) is optional but recommended
for editing one config file in Step 3.

---

## Step 1 — Get the code

Pick **one** of the two options below.

### Option A — Clone from GitHub
Open a terminal, navigate to the folder where you want the project to live,
then run:

```
git clone https://github.com/joenash156/agrify.git
cd agrify
```

### Option B — Download the ZIP
1. On the GitHub repository page, click the green **Code** button, then
   **Download ZIP**.
2. Extract the ZIP file anywhere on your computer (right-click → Extract
   All on Windows, or double-click on macOS).
3. Open a terminal and navigate into the extracted folder, e.g.:
   ```
   cd Downloads\agrify-main
   ```
   (the exact folder name depends on how it was extracted — look for the
   folder that directly contains `backend` and `frontend` subfolders).

Either way, you should now be sitting in a folder that contains two
subfolders: `backend` and `frontend`. Everything below refers to paths
relative to this folder.

---

## Step 2 — Set up the database

The project ships with ready-made SQL scripts that create the database,
every table, starter data, and some reporting views — you don't need to
write any SQL yourself.

> **Note:** creates a database called
> `farm_management`. If you already have a database with that exact name
> that you care about, back it up first.

The scripts live in `backend/database/db/`. The one you actually run is
`run_all.sql` — it runs all the others in the correct order for you.

### Using MySQL Workbench (easiest for beginners)
1. Open MySQL Workbench and connect to your local MySQL server.
2. `File → Open SQL Script...` and select
   `backend/database/db/run_all.sql`.
3. Click the lightning-bolt "Execute" button (or press Ctrl+Shift+Enter) to
   run the whole script.
4. Wait for it to finish — you should see "Action Output" showing green
   checkmarks and no red errors. This creates the `farm_management`
   database with all its tables, views, and starter data.

### Using the command line instead
From inside the `backend/database/db/` folder:

```
mysql -u root -p < run_all.sql
```

Enter your MySQL root password when prompted.

---

## Step 3 — Configure and run the backend

### 3a. Point it at your MySQL
Open `backend/src/main/resources/application.properties` in a text editor.
You'll see these lines near the top:

```
spring.datasource.url=jdbc:mariadb://localhost:3306/farm_management?allowPublicKeyRetrieval=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=1234
```

Change `spring.datasource.password` to whatever password you set for MySQL
root in Step 1. If your MySQL username isn't `root`, change
`spring.datasource.username` too. Save the file.

(The driver is labeled "mariadb" — that's just the name of the client
library being used; it connects to real MySQL Server just fine.)

### 3b. Run it
You do **not** need to install Maven separately — the project bundles a
wrapper script that downloads everything it needs automatically.

From inside the `backend` folder:

**Windows:**
```
cd backend
mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```
cd backend
./mvnw spring-boot:run
```

The first run will take a few minutes while it downloads dependencies —
that's normal. When it's ready, you'll see a line like:

```
Started FarmManagementApplication in X.XXX seconds
```

Leave this terminal window open and running — this is your backend server.
To confirm it's alive, visit http://localhost:8080/swagger-ui.html in a
browser; you should see an API documentation page.

---

## Step 4 — Run the frontend

Open a **second, separate terminal window** (leave the backend running in
the first one). From the project root:

```
cd frontend
npm install
npm run dev
```

`npm install` downloads the frontend's dependencies — this only needs to
happen once (or again later if dependencies change). It may take a minute.

`npm run dev` starts the frontend. You'll see output like:

```
  VITE ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Open that address (http://localhost:5173) in your browser. You should see
the Agrify login page.

---

## Step 5 — Log in

The database setup script seeds four ready-to-use accounts, one per role:

| Role         | Username       | Password    |
|--------------|----------------|-------------|
| Admin        | `admin`        | `admin123`  |
| Farm Manager | `farm.manager` | `manager123`|
| Sales Person | `sales.person` | `sales123`  |
| Worker       | `field.worker` | `worker123` |

Log in as `admin` / `admin123` first — that account can see and manage
everything. Try the other roles afterward to see how the app looks for
each one.

---

## Stopping the app

In each terminal window (backend and frontend), press `Ctrl+C` to stop it.
MySQL can keep running in the background — you don't need to stop it
between sessions.

## Starting it again later

You don't need to repeat Step 2 (the database setup) again — it only needs
to run once, unless you want to wipe everything back to the starter data.
Each time you want to run the app again, just repeat Step 3b (start the
backend) and Step 4 (start the frontend).

---

## Troubleshooting

**"Access denied for user 'root'@'localhost'" when the backend starts**
Your `application.properties` password doesn't match your actual MySQL
root password. Re-check Step 3a.

**Backend fails to start, mentions a port already in use (8080)**
Something else on your computer is already using port 8080. Either stop
that program, or change `server.port=8080` in `application.properties` to
a free port like `8081` — if you do this, also update
`VITE_API_BASE_URL` for the frontend (create a file `frontend/.env.local`
containing `VITE_API_BASE_URL=http://localhost:8081/api`).

**Frontend shows a blank page or "Network Error" in the browser console**
The backend probably isn't running yet, or crashed. Check the backend
terminal window for errors, and make sure it printed "Started
FarmManagementApplication" before you loaded the frontend.

**Browser console shows a CORS error**
The backend only accepts requests from `http://localhost:5173` by default.
Make sure the frontend is actually running on port 5173 (check the `npm
run dev` output) and that you're opening that exact address in the
browser.

**`./mvnw: Permission denied` on macOS/Linux**
Run `chmod +x mvnw` inside the `backend` folder once, then try again.

**`java -version` shows an older version even after installing JDK 25**
You likely have multiple Java versions installed and an older one is first
on your system PATH. Search your OS's instructions for "how to switch
active JDK version" (e.g. `JAVA_HOME` on Windows/macOS/Linux) and point it
at your JDK 25 install.

**MySQL Workbench script fails partway through with a red error**
Make sure you ran `run_all.sql` (not one of the individual files in that
folder on its own) — the individual files only work in a specific order
that `run_all.sql` already handles for you.

---

## Quick reference

```
# One-time setup
1. Install Git (if cloning), JDK 25, Node.js 20+, MySQL 8.0
2. Get the code (git clone, or download + extract ZIP)
3. Run backend/database/db/run_all.sql against MySQL
4. Edit backend/src/main/resources/application.properties with your
   MySQL password

# Every time you want to run the app (two terminals, both left open)
Terminal 1:  cd backend  &&  mvnw.cmd spring-boot:run     (Windows)
             cd backend  &&  ./mvnw spring-boot:run        (macOS/Linux)
Terminal 2:  cd frontend &&  npm run dev

# URLs
Backend:   http://localhost:8080
Frontend:  http://localhost:5173   <-- open this one in your browser

# Demo logins
admin / admin123
farm.manager / manager123
sales.person / sales123
field.worker / worker123
```
