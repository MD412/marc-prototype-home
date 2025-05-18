# My Bookshelf Prototype

A reading tracker powered by a Notion database. This prototype demonstrates how to integrate Notion as a backend for your web applications.

## Features

- Display books from your Notion database in a gallery format
- Filter books by genre
- Search books by title or author
- View book details including cover image, rating, and review

## Setup

### 1. Create a Notion Database

1. In Notion, create a new database with the following properties:
   - Title (title type)
   - Author (rich text type)
   - Genre (single select type)
   - Cover Image (files type)
   - Rating (number type)
   - Review (rich text type)

2. Add some sample books to your database.

### 2. Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name your integration (e.g., "My Bookshelf Integration")
4. Select the workspace that contains your book database
5. Click "Submit" to create the integration
6. Copy the "Internal Integration Token" 

### 3. Share Your Database with the Integration

1. Open your book database in Notion
2. Click the "..." menu in the top-right corner
3. Go to "Add connections"
4. Search for and select your integration

### 4. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NOTION_API_KEY=your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

The database ID is the part of your database URL after the workspace name and before the question mark:
```
https://www.notion.so/workspace-name/database-id?v=...
```

## Running the Prototype

After setting up your Notion integration and environment variables, run the project:

```
npm run dev
```

Visit `http://localhost:3000/prototypes/my-bookshelf` to see your bookshelf!

## Customization

- Modify the `BookCard.tsx` component to change how books are displayed
- Update the styling in `BookCard.module.css` and `styles.module.css`
- Add additional filters or sorting options in the `page.tsx` file 