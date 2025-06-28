import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useState } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import CustomButton from '../components/CustomButton';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [audioFileUri, setAudioFileUri] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  const handleStartRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      setIsRecording(true);
      setAudioFileUri('');
      setTranscription('');
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      await audioRecorder.stop();
      if (audioRecorder.uri) {
        setAudioFileUri(audioRecorder.uri);
      }
      setIsRecording(false);
      console.log('Recording saved to:', audioRecorder.uri);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  const handleConvert = async () => {
    if (!audioFileUri) {
      Alert.alert('No audio file to convert');
      return;
    }

    setIsConverting(true);
    try {
      const base64Audio = await FileSystem.readAsStringAsync(audioFileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Call ElevenLabs Speech-to-Text API directly
      const formData = new FormData();
      formData.append('file', {
        uri: audioFileUri,
        type: 'audio/m4a',
        name: 'audio.m4a'
      } as any);
      formData.append('model_id', 'scribe_v1');
      formData.append('language_code', 'en');

      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': 'sk_6837ccaf01fad96872dee305a53f515dd273fa5644571018'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Transcription result:', data);
      setTranscription(data.text || 'No transcription available');
    } catch (error) {
      console.error('Error converting speech to text:', error);
      Alert.alert('Error', 'Failed to convert speech to text. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech to Text</Text>
      
      {isRecording ? (
        <Pressable
          onPress={handleStopRecording}
          style={styles.recordButtonRecording}
        >
          <Text style={styles.recordButtonText}>Stop</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={handleStartRecording}
          style={styles.recordButton}
        >
          <Text style={styles.recordButtonText}>Record</Text>
        </Pressable>
      )}

      {audioFileUri && (
        <View style={styles.audioSection}>
          <AudioPlayer
            uri={audioFileUri}
            onPlaybackPositionChange={setPlaybackPosition}
          />
          <CustomButton 
            title={isConverting ? 'Converting...' : 'Convert to Text'} 
            onPress={handleConvert}
            disabled={isConverting}
          />
        </View>
      )}

      {transcription && (
        <View style={styles.transcriptionSection}>
          <Text style={styles.transcriptionTitle}>Transcription:</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      )}
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
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  recordButtonRecording: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  recordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioSection: {
    gap: 10,
  },
  transcriptionSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  transcriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});
