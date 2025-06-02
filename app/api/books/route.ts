import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { PageObjectResponse, RichTextItemResponse, SelectPropertyItemObjectResponse, FilesPropertyItemObjectResponse, NumberPropertyItemObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Define the expected property types for our database
interface BookProperties {
  Title: { type: "title"; title: Array<RichTextItemResponse>; id: string };
  Author: { type: "rich_text"; rich_text: Array<RichTextItemResponse>; id: string };
  Genre: SelectPropertyItemObjectResponse;
  "Cover Image": FilesPropertyItemObjectResponse;
  Rating: NumberPropertyItemObjectResponse;
  Review: { type: "rich_text"; rich_text: Array<RichTextItemResponse>; id: string };
}

export async function GET() {
  try {
    // Debug: Log environment variables (partially masked for security)
    console.log('NOTION_API_KEY:', process.env.NOTION_API_KEY ? `${process.env.NOTION_API_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('NOTION_DATABASE_ID:', process.env.NOTION_DATABASE_ID || 'NOT SET');
    
    // Initialize the Notion client with the API key
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      console.log('Database ID is missing!');
      return NextResponse.json(
        { error: 'Notion database ID is not configured' },
        { status: 500 }
      );
    }

    if (!process.env.NOTION_API_KEY) {
      console.log('API Key is missing!');
      return NextResponse.json(
        { error: 'Notion API key is not configured' },
        { status: 500 }
      );
    }

    console.log('About to query Notion database...');
    
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

    console.log('Notion query successful, found', response.results.length, 'books');

    // Map the Notion response to our book format
    const books = response.results.map((page) => {
      // Assert the page type as PageObjectResponse with our BookProperties
      const notionPage = page as PageObjectResponse & { properties: BookProperties };
      const { properties } = notionPage;
      
      // Get the cover image URL, handling both file types
      const coverImageFile = properties['Cover Image'].files[0];
      const coverImageUrl = coverImageFile?.type === 'file' 
        ? coverImageFile.file.url
        : coverImageFile?.type === 'external' 
          ? coverImageFile.external.url 
          : '';

      // Extract and format book properties
      return {
        id: notionPage.id,
        title: properties.Title.title[0]?.plain_text || 'Untitled',
        author: properties.Author.rich_text[0]?.plain_text || 'Unknown Author',
        genre: properties.Genre.select?.name || '',
        coverImage: coverImageUrl,
        rating: properties.Rating.number || 0,
        review: properties.Review.rich_text[0]?.plain_text || '',
        createdTime: notionPage.created_time,
        lastEditedTime: notionPage.last_edited_time,
      };
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books from Notion:', error);
    
    // Enhanced error logging
    if (error && typeof error === 'object') {
      console.error('Error details:', {
        name: (error as any).name,
        message: (error as any).message,
        code: (error as any).code,
        status: (error as any).status
      });
    }
    
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else {
      try {
        message = JSON.stringify(error);
      } catch {
        message = String(error);
      }
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 