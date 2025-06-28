import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Define the Tweet type based on the provided data
export type Tweet = {
  id: string;
  user_posted: string;
  name: string;
  description: string;
  date_posted: string;
  photos?: string[];
  url: string;
  replies: number;
  reposts: number;
  likes: number;
  views: number;
  followers: number;
  biography: string;
  posts_count: number;
  profile_image_link: string;
  following: number;
  is_verified: boolean;
  verification_type?: string;
};

// Props type
interface DummyTweetProps {
  tweet: Tweet;
}

export default function DummyTweet({ tweet }: DummyTweetProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: tweet.profile_image_link }}
          style={styles.avatar}
        />
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{tweet.name}</Text>
            {tweet.is_verified && <Text style={styles.verified}> ✔️</Text>}
          </View>
          <Text style={styles.username}>@{tweet.user_posted}</Text>
        </View>
      </View>
      <Text style={styles.description}>{tweet.description}</Text>
      {tweet.photos && tweet.photos.length > 0 && (
        <Image source={{ uri: tweet.photos[0] }} style={styles.tweetImage} />
      )}
      <Text style={styles.date}>
        {new Date(tweet.date_posted).toLocaleString()}
      </Text>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>💬 {tweet.replies}</Text>
        <Text style={styles.stat}>🔁 {tweet.reposts}</Text>
        <Text style={styles.stat}>❤️ {tweet.likes}</Text>
        <Text style={styles.stat}>👁️ {tweet.views}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    maxWidth: 500,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
  },
  verified: {
    color: '#1da1f2',
    marginLeft: 4,
    fontSize: 16,
  },
  username: {
    color: '#657786',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  tweetImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  date: {
    color: '#657786',
    fontSize: 13,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    fontSize: 14,
    color: '#657786',
    justifyContent: 'flex-start',
  },
  stat: {
    marginRight: 16,
    color: '#657786',
    fontSize: 14,
  },
});
