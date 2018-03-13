import os
import re
import sys
import csv
import tweepy
from tweepy import OAuthHandler
from textblob import TextBlob
from textblob.classifiers import NaiveBayesClassifier


class TwitterClient(object):
    '''           
    Classe generica
    '''
    def __init__(self, query, retweets_only=False):
        
        consumer_key = 'ugo5bNfeYr82v1vPmmAxxqZLs'
        consumer_secret = 'i0JbFr06bQlAlJyilA3JZpNm1muns0WNsyWz9ahuOde8xwFW7H'
        access_token = '805159244270104576-4DMAk7ijvgfLwxxFh2MDbkA3iUsD6xh'
        access_token_secret = 'mKOD4uQb2W2kV3P0BBYnqQkwgvcLGM7g1EkePFZDvwdWz'
        
        try:
            self.auth = OAuthHandler(consumer_key, consumer_secret)
            self.auth.set_access_token(access_token, access_token_secret)
            self.query = query
            self.retweets_only = retweets_only
            self.api = tweepy.API(self.auth)
            self.tweet_count_max = 50  #previnir rate limit
        except:
            print("Error: Authentication Failed")

    def set_query(self, query=''):
        self.query = query

    def set_retweet_checking(self, retweets_only='false'):
        self.retweets_only = retweets_only

    def clean_tweet(self, tweet):
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split())

    def get_tweet_sentiment(self, tweet):
        analysis = TextBlob(self.clean_tweet(tweet))
        if analysis.sentiment.polarity > 0:
            return 'positive'
        elif analysis.sentiment.polarity == 0:
            return 'neutral'
        else:
            return 'negative'    
   
    def get_tweets(self):
        tweets = []

        try:
            search = self.api.search(q=self.query,count=self.tweet_count_max)
            if not search:
               pass
            for tweet in search:
                tweets_list = {}

                tweets_list['user'] = tweet.user.screen_name
                tweets_list['text'] = tweet.text
                tweets_list['sentiment'] = self.get_tweet_sentiment(tweet.text)

                if tweet.retweet_count > 0 and self.retweets_only == 1:
                   if tweets_list not in tweets:
                      tweets.append(tweets_list)
                elif not self.retweets_only:
                   if tweets_list not in tweets:
                      tweets.append(tweets_list)   

            return tweets  

        except tweepy.TweepError as e:
                print('Error: ' + str(e))       


