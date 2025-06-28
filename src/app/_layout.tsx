import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Text to Speech',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name='file-audio' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='speech-to-text'
        options={{
          title: 'Speech to Text',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name='microphone' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='tweet-to-speech'
        options={{
          title: 'Tweet to Speech',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name='twitter' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
