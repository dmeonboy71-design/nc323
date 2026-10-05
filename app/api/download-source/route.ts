import { NextResponse } from 'next/server';
import { ZipArchive } from 'archiver';
import { PassThrough, Readable } from 'stream';

export async function GET() {
  try {
    const archive = new ZipArchive({ zlib: { level: 9 } });
    const passthrough = new PassThrough();

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      passthrough.destroy(err);
    });

    archive.pipe(passthrough);

    archive.glob('**/*', {
      cwd: process.cwd(),
      ignore: [
        'node_modules/**',
        '.next/**',
        'dist/**',
        '.git/**',
        '.telegram-config.json',
        '.env*.local'
      ]
    });

    archive.finalize().catch((err) => {
      console.error('Finalize error:', err);
    });

    const webStream = Readable.toWeb(passthrough) as ReadableStream<Uint8Array>;

    return new Response(webStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="pakistan-youth-loan-portal-source.zip"'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
