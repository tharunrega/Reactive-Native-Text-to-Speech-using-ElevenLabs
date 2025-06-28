import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import CustomButton from '../components/CustomButton';
import * as FileSystem from 'expo-file-system';
import AudioPlayer from '../components/AudioPlayer';
import { Buffer } from 'buffer';
import DummyTweet from '../components/DummyTweet';

export default function TweetToSpeech() {
  const [tweet, setTweet] = useState('');
  const [tweetData, setTweetData] = useState<any>(null);
  const [audioFileUri, setAudioFileUri] = useState('');
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const handleConvert = async () => {
    const response = await fetch('/api/tweet', {
      method: 'POST',
      body: JSON.stringify({ tweetUrl: tweet }),
    });

    const data = await response.json();
    console.log('data', JSON.stringify(data, null, 2));
    setTweetData(data.tweet);
    handleConvertToSpeech(data.tweet.description);
  };

  const handleConvertToSpeech = async (text: string) => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      body: JSON.stringify({
        text,
      }),
    });

    if (!response.ok) {
      console.log('Failed to fetch audio');
      throw new Error('Failed to fetch audio');
    }

    try {
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const fileUri =
        FileSystem.documentDirectory + new Date().toISOString() + '.mp3';

      await FileSystem.writeAsStringAsync(
        fileUri,
        Buffer.from(uint8Array).toString('base64'),
        { encoding: FileSystem.EncodingType.Base64 }
      );

      setAudioFileUri(fileUri);
    } catch (error) {
      console.log('Failed to saved the generated audio file.', error);
    }
  };

  return (
    <View style={styles.container}>
      {tweetData ? (
        <DummyTweet tweet={tweetData} />
      ) : (
        <>
          <TextInput
            placeholder='Enter a tweet url'
            style={styles.input}
            value={tweet}
            onChangeText={setTweet}
          />
          <CustomButton title='Convert to speech' onPress={handleConvert} />
        </>
      )}

      {audioFileUri && (
        <AudioPlayer
          uri={audioFileUri}
          onPlaybackPositionChange={setPlaybackPosition}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    gap: 10,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gainsboro',
  },
});
