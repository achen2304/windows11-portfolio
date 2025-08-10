import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'portfolio';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  clientPromise = client.connect();
}

async function connectToDatabase() {
  try {
    const client = await clientPromise;
    return client.db(DB_NAME);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export interface Comment {
  _id?: ObjectId;
  username: string;
  handle: string;
  content: string;
  timestamp: Date;
  likes: number;
}

// Rate limiting
const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 3,
};

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - userLimit.timestamp > RATE_LIMIT.windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    return true;
  }

  userLimit.count++;
  return false;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  return 'unknown';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = parseInt(searchParams.get('limit') || '20');
    const limit = requestedLimit >= 1000 ? 0 : Math.min(requestedLimit, 50);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const skip = requestedLimit >= 1000 ? 0 : (page - 1) * limit;

    const db = await connectToDatabase();
    const collection = db.collection<Comment>('comments');

    const sortBy = searchParams.get('sort') || 'date';

    let sortOrder: Record<string, 1 | -1> = { timestamp: -1 };
    if (sortBy === 'likes') {
      sortOrder = { likes: -1, timestamp: -1 };
    }

    let query = collection.find({}).sort(sortOrder).skip(skip);

    if (limit > 0) {
      query = query.limit(limit);
    }

    const [comments, total] = await Promise.all([
      query.toArray(),
      collection.countDocuments({}),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before posting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, handle, content } = body;

    if (!username || !content) {
      return NextResponse.json(
        { error: 'Username and content are required' },
        { status: 400 }
      );
    }

    if (content.length > 280) {
      return NextResponse.json(
        { error: 'Content must be 280 characters or less' },
        { status: 400 }
      );
    }

    if (username.length > 50 || (handle && handle.length > 50)) {
      return NextResponse.json(
        { error: 'Username and handle must be 50 characters or less' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection<Comment>('comments');

    const newComment: Omit<Comment, '_id'> = {
      username: username.trim(),
      handle: handle ? handle.trim().replace(/^@/, '') : '',
      content: content.trim(),
      timestamp: new Date(),
      likes: 0,
    };

    const result = await collection.insertOne(newComment);

    const insertedComment = {
      ...newComment,
      _id: result.insertedId,
    };

    return NextResponse.json(
      {
        success: true,
        comment: insertedComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');
    const action = searchParams.get('action');

    if (!commentId || !action) {
      return NextResponse.json(
        { error: 'Comment ID and action are required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection<Comment>('comments');

    const updateOperation =
      action === 'like' ? { $inc: { likes: 1 } } : { $inc: { likes: -1 } };

    const result = await collection.updateOne(
      { _id: new ObjectId(commentId) },
      updateOperation
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const updatedComment = await collection.findOne({
      _id: new ObjectId(commentId),
    });

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId || !ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { error: 'Valid comment ID is required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection<Comment>('comments');

    await collection.deleteMany({
      $or: [
        { _id: new ObjectId(commentId) },
        { replyTo: new ObjectId(commentId) },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
