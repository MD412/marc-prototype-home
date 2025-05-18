import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function GET() {
  try {
    // Initialize the Notion client with the API key
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      return NextResponse.json(
        { error: 'Notion database ID is not configured' },
        { status: 500 }
      );
    }

    // Query the database
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Title',
          direction: 'ascending',
        },
      ],
    });

    // Map the Notion response to our book format
    const books = response.results.map((page) => {
      const properties = page.properties as any;
      
      // Extract and format book properties
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        author: properties.Author?.rich_text?.[0]?.plain_text || 'Unknown Author',
        genre: properties.Genre?.select?.name || '',
        coverImage: properties['Cover Image']?.files?.[0]?.file?.url || 
                   properties['Cover Image']?.files?.[0]?.external?.url || '',
        rating: properties.Rating?.number || 0,
        review: properties.Review?.rich_text?.[0]?.plain_text || '',
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      };
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books from Notion' },
      { status: 500 }
    );
  }
} 