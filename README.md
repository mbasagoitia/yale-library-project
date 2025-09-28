# Yale Philharmonia Library Catalogue Application

A desktop application developed specifically for and used internally by the Yale School of Music for cataloguing, reporting, and managing the Yale Philharmonia Library collection.

A demo build is available for outside review.

This project replaces a slow, spreadsheet-based workflow with a **fast, centralized system** for tracking, searching, and organizing scores and parts.

Built with [Electron](https://www.electronjs.org/), [React](https://reactjs.org/), and [Node/Express](https://expressjs.com/) as a portfolio project to demonstrate full-stack desktop app development.

---

## Features

- **Catalogue and Manage Library Holdings**  
  - Add new scores or parts with automatically-generated call numbers
  - Thorough metadata records (condition, public domain, missing parts, etc.)
  - Edit or delete existing holdings  
  - Automatic record validation

- **Browse & Search**  
  - Filter (basic or advanced) by composer, title, publisher, and/or genre
  - Quick navigation between works and their Digital Catalogue counterparts

- **Digital Catalogue Management**  
  - View and organize scanned PDFs or born-digital materials  
  - Upload, preview, and open files locally

- **Generate Reports**  
  - Automatically generate and export custom reports (by composer, condition, missing part status, etc.)  
  - Summarize holdings for inventory or programming purposes

- **Data Backups**
  - Export holdings data as a CSV file to preserve data/transfer to another system
  - Automatically compress and export the digital catalogue

- **Admin Management**  
  - User authentication handled via Yale University's Central Authentication System (CAS), with additional RBAC logic for app-specific permissions
  - Admins can add/remove other admins and manage library settings/holdings

---

## Tech Stack

- **Frontend:** React/Redux, React Bootstrap, custom CSS  
- **Backend:** Node.js, Express  
- **Database:** SQLite (demo) / MySQL (internal)
- **Cloud:** Internal database hosted on Google Cloud Platform VM
- **Desktop shell:** Electron  
- **Authentication:** Yale CAS, jsonwebtoken

## Development Notes

Built as a real-world tool adopted and currently used by the Yale School of Music to improve workflow, this application also showcases:

- Cross-platform desktop development
- Secure authentication and role management 
- CRUD interfaces and data validation
- Clean code structure and component-based UI with modern state management tools (Redux, Electron store)
- Security Features
  - Parameterized queries to prevent SQL injection
  - Secure storage of credentials and environment variables
  - XSS sanitization middleware for user input
  - Authentication and role-checking middleware to protect admin-only routes

---

## Why This App

The library’s spreadsheet system was slow, hard to scale, and scattered across multiple procedures.  
This project centralizes cataloguing, searching, reporting, and administration in one intuitive app — saving staff time and reducing errors.

---

## Getting Started

### Option 1: Download the Demo (Recommended)

1. Download the packaged build (`LibraryCatalogue-demo.exe`, `.dmg`, or `.AppImage`).  
2. Double-click to run — demo data is preloaded.

### Option 2: Run the Demo from Source (For Developers)

This project is designed to run in **demo** mode for local development.

*Internal mode requires protected assets and environment files that are not included in this repository, so attempting to run in internal mode will break the build.*

1. Clone the repository.  
2. Install dependencies:
   ```bash
   npm install
3. This project uses .env.development.demo for demo mode configuration.
    ```bash
    npm run prepare-env
Or, manually copy .env.development.demo.example → .env.development.demo.
3. Start in development mode:
    ```bash
    npm run start:demo

This runs:

- The React development server
- Your backend server
- Electron app in demo mode

## Demo vs Internal Builds

This project has two versions:

- **Demo Build:** Safe for public review, uses sample data, and contains no sensitive keys.  
- **Internal Build:** Configured with private environment variables and deployed only within the Yale School of Music.

The source code runs in demo mode by default. To protect library data, the internal version requires a protected configuration and is not publicly distributed.

### Database

The **demo database** contains a small subset of the Philharmonia's catalogue holdings, along with public-domain scans sourced from IMSLP, for demonstration purposes only. The demo SQLite database is built and bundled locally.

The **internal database** is hosted on MySQL in a virtual machine on Google Cloud Platform and requires configuration and authentication available only to users of the internal build. The database is hosted remotely to allow connections from multiple clients in the Yale School of Music.

### Fonts & Assets

#### Fonts

Licensed Yale typeface and other proprietary assets are included only in the internal build, in accordance with Yale University’s licensing agreements.

The public demo build uses open-source or system-default typefaces to ensure that no protected intellectual property is distributed.

#### Images

- All original images are used with permission from the Yale media and communications department
- Decorative images are sourced from <a href="https://unsplash.com/">Unsplash</a>, an open-source image repository.

- Desktop icon: <a href="https://www.flaticon.com/free-icons/music-book" title="music book icons">Music book icons created by Freepik - Flaticon</a>

#### Build Size

This demo build is approximately 800 MB. The larger size is intentional:

It includes multiple full-length PDF music scans for demonstration purposes only. These files are bundled locally so the app works with no external dependencies.

The build also contains the standard Electron runtime (~150–200 MB).

In the production build, the digital catalogue is not bundled locally. The application is designed to have the PDFs hosted on the user's computer or an external service.

Since this project is designed as a portfolio demo, the complete set of materials is included to fully demonstrate the app’s functionality.

## Classification Guide

This application is designed to implement and follow the **Dickinson Classification Scheme for Musical Compositions**, a system widely adopted by music libraries, including those at Vassar College and Columbia University. An overview and examples can be found here: https://www.jstor.org/stable/23505207

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Future Additions and Improvements

- Bulk import of library records
- Advanced batch editing tools
- Improved reporting filters and templates
- Add optional cloud integration for digital catalogue (BackBlaze or similar)
- Add metadata for advanced filtering in digital catalogue