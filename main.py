import datetime

from functools import wraps
from flask import Flask, render_template, request, session, flash
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token

import random
import string

firebase_request_adapter = requests.Request()

app = Flask(__name__)

app.secret_key = ''.join(random.choice(string.ascii_letters) for i in range(128))

datastore_client = datastore.Client()

user_data = None

#wrapper function call every time when enter direct to inside system
def login_required(function_to_protect):
    @wraps(function_to_protect)
    def wrapper(*args, **kwargs):
        id_token = request.cookies.get("token")
        if id_token:
            try:
                # Verify the token against the Firebase Auth API. This example
                # verifies the token on each page load. For improved performance,
                # some applications may wish to cache results in an encrypted
                # session store (see for instance
                # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
                claims = google.oauth2.id_token.verify_firebase_token(
                    id_token, firebase_request_adapter)

                session["user_data"] = claims
                
                return function_to_protect(*args, **kwargs)

            except ValueError as exc:
                # This will be raised if the token is expired or any other
                # verification checks fail.
                flash("Session exists, but user does not exist (anymore)")
                return render_template( 'index.html'  )
        else:
            return render_template( 'index.html' )

    return wrapper

@app.route('/')
def root(): 
    return render_template( 'index.html' )

@app.route('/logout')
@login_required
def logout(): 
    request.cookies.clear()
    session["user_data"] = ""
    return render_template( 'index.html' )

@app.route('/saveprice')
def saveprice(): 
    symbol_name = request.args.get('symbol_name')
    price = request.args.get('price')
    with open( "D:/Projects/DQMobile/Symbols/{}".format(symbol_name), mode='a', newline='\n', encoding='utf-8') as fh:
        line = "{symbol_name='"+symbol_name+f"',price_data:{price}"+"}"
        fh.writelines("%s\n" % line)
        fh.close()

    return render_template( 'getprice.html', symbol_name=symbol_name, price=price )

@app.route('/login')
def authen():
    # Verify Firebase auth.
    id_token = request.cookies.get("token")
    error_message = None
    claims = None
    times = None
    if id_token:
        try:
            # Verify the token against the Firebase Auth API. This example
            # verifies the token on each page load. For improved performance,
            # some applications may wish to cache results in an encrypted
            # session store (see for instance
            # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
            claims = google.oauth2.id_token.verify_firebase_token(
                id_token, firebase_request_adapter)

            session["user_data"] = claims

        except ValueError as exc:
            # This will be raised if the token is expired or any other
            # verification checks fail.
            error_message = str(exc)

        # Record and fetch the recent times a logged-in user has accessed
        # the site. This is currently shared amongst all users, but will be
        # individualized in a following step.
        store_time(datetime.datetime.now())
        times = fetch_times(10)

        return render_template(
            'gentelella/index.html',title="DQ Mobile",
            user_data=claims, error_message=error_message, times=times)
    else:
        return render_template(
            'index.html',
            user_data=claims, error_message=error_message, times=times)

@app.route('/redirect')
@login_required
def redirect(): 

    #prepare global var
    #user profile here
    print('User Session >> '+str(len(session["user_data"])))
    user_data=session["user_data"]

    dest_uri = request.args.get('dest_uri')
    title='DQ Mobile'
    return render_template(
            f'gentelella/{dest_uri}',title=title , user_data=user_data )

@app.route('/charts')
@login_required
def charts(): 
    return render_template(
            'gentelella/chartjs.html',title='Chart JS')
    
@app.route('/serviceworker.js')
def sw():
    return app.send_static_file('./serviceworker.js')

def store_time(dt):
    entity = datastore.Entity(key=datastore_client.key('visit'))
    entity.update({
        'timestamp': dt
    })

    datastore_client.put(entity)


def fetch_times(limit):
    query = datastore_client.query(kind='bot-trade')
    #query.order = ['timestamp']

    times = query.fetch(limit=limit)

    return times

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
    

