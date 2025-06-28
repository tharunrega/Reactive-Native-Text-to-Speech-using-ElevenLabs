import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import AudioPlayer from '../components/AudioPlayer';
import CustomButton from '../components/CustomButton';

export default function App() {
  const [text, setText] = useState('');
  const [audioFileUri, setAudioFileUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text to convert');
      return;
    }

    setIsLoading(true);
    console.log('Converting text:', text);

    try {
      // Call ElevenLabs API directly
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb/stream', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': 'sk_6837ccaf01fad96872dee305a53f515dd273fa5644571018'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          output_format: 'mp3_44100_128'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const fileUri = FileSystem.documentDirectory + 'audio_' + new Date().toISOString() + '.mp3';

      await FileSystem.writeAsStringAsync(
        fileUri,
        Buffer.from(uint8Array).toString('base64'),
        { encoding: FileSystem.EncodingType.Base64 }
      );

      setAudioFileUri(fileUri);
      console.log('Audio saved to:', fileUri);
    } catch (error) {
      console.error('Error converting text to speech:', error);
      Alert.alert('Error', 'Failed to convert text to speech. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Text to Speech</Text>
      
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder='Enter text to convert to speech...'
        style={styles.input}
        multiline
        numberOfLines={4}
      />

      <CustomButton 
        title={isLoading ? 'Converting...' : 'Convert to Audio'} 
        onPress={handleConvert}
        disabled={isLoading}
      />

      {audioFileUri && <AudioPlayer uri={audioFileUri} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    minHeight: 120,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});
