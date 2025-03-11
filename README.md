# Fetch Dog Directory

Welcome to the **Fetch Dog Directory**, a web application that allows users to browse and search for adoptable dogs using filters such as breed, location (ZIP code), and radius. The project was built as part of the Fetch Frontend Engineer Take-Home Exercise.

## 🚀 Features
- **User Authentication**: Users log in with their name and email.
- **Dog Search**:
  - Filter by breed
  - Filter by ZIP code with adjustable search radius
  - Sort results alphabetically by breed (ascending/descending)
  - Paginated results for easy browsing

## 🛠️ Tech Stack
- **Frontend**: React (Vite) + TypeScript
- **UI Framework**: Material UI (MUI) + Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: Fetch API with authentication cookies
- **Hosting**: Firebase

## 📦 Installation & Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/fetch-challenge.git
   cd fetch-challenge
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173/`

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🖥️ Usage
- **Login**: Enter your name and email to authenticate.
- **Search for Dogs**:
  - Use the breed filter to search for specific breeds.
  - Enter a ZIP code and select a radius to find dogs nearby.
  - Sort results alphabetically.
- **Pagination**: Click "Next" and "Prev" to navigate through results.
