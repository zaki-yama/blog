import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '../../../../lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Only allow uploads in development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Upload endpoint is only available in development environment' },
        { status: 403 }
      );
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString('base64')}`,
      {
        folder: 'blog-images',
        resource_type: 'auto',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      }
    );

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}