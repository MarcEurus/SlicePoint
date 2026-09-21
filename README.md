SlicePoint
SlicePoint is a modern Angular + Ionic product management dashboard for tracking and organizing a catalog of items. It includes product creation, editing, deletion, category filtering, search, local persistence, and a responsive light/dark theme.

Features
Product catalog dashboard with cards
Add new products
Edit existing products
Delete products
Search by product name
Filter by category
Seeded sample inventory
Local storage persistence
Responsive layout
Light and dark mode toggle
Tech Stack
Angular
Ionic Framework
TypeScript
SCSS
LocalStorage for persistence
Project Structure
src/app/home - main dashboard UI
src/app/products - product model, data, and service
global.scss - global styling and theme variables
src/environments - environment configuration
Getting Started
Install dependencies:
npm install

Start the app:
npm start

Open the app in your browser:
http://localhost:4200

Build
To build the project for production:

npm run build

Test
To run unit tests:
npm test -- --watch=false

Lint
To lint the project:

npm run lint

Notes
This app uses browser localStorage so product data persists between refreshes. The default dataset is seeded on first load and can be modified through the UI.

License
This project is for educational/demo purposes.
