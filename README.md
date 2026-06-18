# TOXIQ Program Management System

An enterprise-grade, full-stack hospital event and scientific article management platform built for the Apex Multi-Specialty Hospital's TOXIQ Program.

---

## Technical Stack
- **Frontend**: React.js + Vite + Material UI (MUI v6)
- **Backend**: Django 5.x + Django REST Framework (DRF)
- **Database**: PostgreSQL (with automatic SQLite fallback for zero-configuration local testing)
- **Authentication**: JWT Authentication (via SimpleJWT)
- **Payment Gateway**: PayU Integration (with built-in high-fidelity Sandbox Simulator)
- **Email Service**: SMTP (with Console logger fallback for testing)
- **Exports**: `openpyxl` (Excel spreadsheets) and `reportlab` (PDF documents)

---

## Default Credentials
For local testing and administration, the database has been seeded with:
- **Admin Username**: `admin`
- **Admin Password**: `admin123`
- **Role**: `SUPER_ADMIN`

---

## How to Run the Project

### 1. Start the Django Backend
The backend runs on port **8001** (as configured in the API integrations).

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment (Windows):
   ```powershell
   venv\Scripts\Activate.ps1
   ```
3. Run database migrations:
   ```bash
   python manage.py migrate
   ```
4. Seed initial database records (if not done already):
   ```bash
   python seed.py
   ```
5. Start the backend server:
   ```bash
   python manage.py runserver 8001
   ```

The backend is now live at `http://localhost:8001`. You can access the standard Django Admin interface at `http://localhost:8001/admin/`.

---

### 2. Start the React Frontend
The frontend runs on port **5173** (Vite default).

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies (already installed on this workspace):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend website is now accessible at `http://localhost:5173`.

---

## Key Feature Flows to Test

1. **Conference Landing Page (`http://localhost:5173`)**:
   - Beautiful parallax hero banner, statistics grids, dynamic CMS "About" details, calendar timelines, and interactive guest speaker circular avatars.

2. **Registration Questionnaire & Payment**:
   - Go to the **Registration** page, fill in the dynamic form fields (includes dropdown selections and file attachments).
   - Click **Register & Pay** (displays calculations including 18% GST).
   - You will be redirected to the **PayU Sandbox Simulator**.
   - Select **Simulate Success** to test the successful path: it updates the database, auto-generates a unique sequential ID (e.g. `TOXIQ0001`), prints the confirmation email to the backend server terminal log, and renders the success landing page with a direct button to download the compiled PDF receipt.

3. **Article Submissions**:
   - Go to the **Article Submission** page.
   - Enter your successful Registration ID (e.g. `TOXIQ0001`) and fill in article details.
   - Upload your research manuscript (validates size under 10MB and PDF/DOCX formats).
   - Click **Submit Article**.

4. **Super Admin CMS & Moderation Control**:
   - Log in using `admin` / `admin123` at the login portal.
   - Access the **Admin Panel** to view the **Dashboard** charts (registrations line charts, revenue bar charts, article doughnut charts).
   - Moderated articles on the **Article Submissions** tab (Approve/Reject decisions with custom reviewer feedback comments).
   - Re-configure the dynamic registration fields, fees, or CMS landing page details dynamically without editing any code.
   - Download consolidated excel lists and landscape-oriented PDF reports on the **Reports & Exports** panel.
