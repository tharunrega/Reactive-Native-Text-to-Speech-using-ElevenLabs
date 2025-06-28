import { ElevenLabsClient } from 'elevenlabs';

const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_6837ccaf01fad96872dee305a53f515dd273fa5644571018';

const client = new ElevenLabsClient({
  apiKey: apiKey,
});

export async function POST(request: Request) {
  const { base64Audio } = await request.json();

  try {
    // Convert base64 to a Blob
    const buffer = Buffer.from(base64Audio, 'base64');
    const audioBlob = new Blob([buffer], { type: 'audio/m4a' });

    const transcription = await client.speechToText.convert({
      file: audioBlob,
      model_id: 'scribe_v1', // Model to use, for now only "scribe_v1" is support.
      tag_audio_events: true, // Tag audio events like laughter, applause, etc.
      language_code: 'eng', // Language of the audio file. If set to null, the model will detect the language automatically.
      diarize: true, // Whether to annotate who is speaking
    });

    return Response.json({ transcription });
  } catch (error) {
    return Response.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
