import { ElevenLabsClient } from 'elevenlabs';

const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_6837ccaf01fad96872dee305a53f515dd273fa5644571018';

const client = new ElevenLabsClient({
  apiKey: apiKey,
});

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return Response.json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const audio = await client.textToSpeech.convertAsStream(
      'JBFqnCBsd6RMkjVDRZzb',
      {
        text,
        model_id: 'eleven_multilingual_v2',
        output_format: 'mp3_44100_128',
      }
    );

    // Collect all chunks into an array
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    // Concatenate all chunks into a single Uint8Array
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
