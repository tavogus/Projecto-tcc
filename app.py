from flask import Flask, request, render_template, jsonify
from twitter import TwitterClient
import json

app = Flask(__name__)
api = TwitterClient('')

def strtobool(v):
    return v.lower() in ["yes", "true", "t", "1"]

@app.route('/')
def index():
    return render_template('index.html')    

@app.route('/tweets')
def tweets():
    retweets_only = request.args.get('retweets_only')
    api.set_retweet_checking(strtobool(retweets_only.lower()))

    query = request.args.get('query')
    api.set_query(query)

    tweets = api.get_tweets()
    
    dados = jsonify({'data': tweets, 'count': len(tweets)})

    return dados
    
app.run(port=5002, debug=True)