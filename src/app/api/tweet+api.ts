import { ElevenLabsClient } from 'elevenlabs';

const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || 'sk_6837ccaf01fad96872dee305a53f515dd273fa5644571018';
const brightDataApiKey = process.env.BRIGHT_DATA_API_KEY || 'your_bright_data_api_key_here';

const client = new ElevenLabsClient({
  apiKey: elevenLabsApiKey,
});

// TOOD: use key from env
async function startScraping(url: string) {
  const data = JSON.stringify([{ url }]);

  const response = await fetch(
    'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwxkxvnf1cynvib9co&include_errors=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${brightDataApiKey}`,
        'Content-Type': 'application/json',
      },
      body: data,
    }
  );
  const responseData = await response.json();

  return responseData.snapshot_id;
}

async function getScrapingResult(snapshotId: string) {
  const response = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    {
      headers: {
        Authorization: `Bearer ${brightDataApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const responseData = await response.json();

  return responseData;
}

async function getTweetData(tweetUrl: string) {
  const snapshotId = await startScraping(tweetUrl);

  let tweetData: any;
  let numberOfAttempts = 0;
  // wait for results / polling
  while (numberOfAttempts < 30) {
    tweetData = await getScrapingResult(snapshotId);
    numberOfAttempts++;

    if (tweetData.status === 'running') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else if (tweetData.status === 'failed') {
      throw new Error('Scraping failed');
    } else {
      break;
    }
  }

  return tweetData;
}

export async function POST(request: Request) {
  const { tweetUrl } = await request.json();

  if (!tweetUrl) {
    return Response.json({ error: 'Tweet URL is required' }, { status: 400 });
  }

  console.log('tweetUrl', tweetUrl);

  try {
    const tweetData = await getTweetData(tweetUrl);

    return Response.json({ tweet: tweetData[0] });
  } catch (error) {
    console.error('Error fetching tweet data:', error);
    return Response.json(
      { error: 'Failed to fetch tweet data' },
      { status: 500 }
    );
  }
}
