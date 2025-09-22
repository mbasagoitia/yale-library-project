# Yale Philharmonia Library Application

A desktop application for cataloguing, reporting, and managing the Yale Philharmonia Library collection.

It replaces a slow, spreadsheet-based workflow with a **fast, centralized system** for tracking, searching, and organizing scores and parts.

Built with [Electron](https://www.electronjs.org/), [React](https://reactjs.org/), and [Node/Express](https://expressjs.com/) as a portfolio project to demonstrate full-stack desktop app development.

---

## Features

- **Catalogue Holdings and Management**  
  - Add new scores or parts with automatically-generated call numbers
  - Advanced metadata records (condition, public domain, missing parts, etc.)
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
  - Permissions handled via Yale Central Authentication System (CAS) authentication  
  - Admins can add/edit other admins and manage library settings/holdings

---

## Tech Stack

- **Frontend:** React/Redux, React Bootstrap, custom CSS  
- **Backend:** Node.js, Express  
- **Database:** SQLite (demo) / MySQL (internal)
- **Cloud:** Internal database hosted on Google Cloud Platform VM
- **Desktop shell:** Electron  
- **Authentication:** Yale CAS, jsonwebtoken

## Development Notes

Built as a real-world tool adopted by Yale University to improve workflow, this app also showcases:

- Cross-platform desktop development
- Secure authentication and role management
- CRUD interfaces and data validation
- Clean code structure and component-based UI with modern state management tools (Redux, Electron store)

---

## Why This App

The library’s spreadsheet system was slow, hard to scale, and scattered across multiple procedures.  
This project centralizes cataloguing, searching, reporting, and administration in one intuitive app — saving staff time and reducing errors.

---

## Getting Started

### Option 1: Download the Demo (Recommended)

1. Download the packaged build (`LibraryCatalogue-demo.exe`, `.dmg`, or `.AppImage`).  
2. Double-click to run — demo data is preloaded.

### Option 2: Run from Source (For Developers)

1. Clone the repository.  
2. Install dependencies:
   ```bash
   npm install
3. Start in development mode:
    npm run start
4. To build a production package:
    npm run build

Environment variables (e.g., database path, CAS keys) are configured via a .env file.
See Environment Variables for setup details.

## Demo vs Internal Builds

This project has two versions:

- Demo Build – safe for public review, uses sample data, no sensitive keys.
- Internal Build – configured with private environment variables and deployed only on the Yale Philharmonia library computer.

The source code runs in demo mode by default; to protect library data, the internal version requires a protected configuration and is not publicly distributed.

## Environment Variables

## Classification Guide

This application is designed to implement and follow the **Dickinson Classification Scheme for Musical Compositions**, a system widely adopted by music libraries, including those at Vassar College and Columbia University. An overview and examples can be found here: https://www.jstor.org/stable/23505207

## Roadmap

- Bulk import of library records
- Advanced batch editing tools
- Optional cloud sync for offsite access
- Improved reporting filters and templates
- Add optional cloud integration for digital catalogue (BackBlaze or similar)
- Add metadata for advanced filtering in digital catalogue
