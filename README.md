Who will win?
=============

Who will win? is a web application which allows users to attempt to guess the
outcome of an URF match randomly pulled from a pool of matches played during
the April 2015 URF event. Once a guess has been made, the user will see a
prediction made by an AI that was trained to predict URF matches, and then a
high level overview of the match will play in fast-foward, showing the
locations of champion deaths for each team as well as when turrets are
destroyed.

Running
-------

This application requires two things to run from a fresh pull: a developer key
from Riot Games, and a list of match IDs from the URF event.

To get a developer key, register for an account in the [Riot Games developer portal](https://developer.riotgames.com/)
(which may require creating a League of Legends account). Next, take the API
key that is received and either upday the .apikey with the API key itself, or
set the environment variable API_KEY to its value.

You will also need a list of match ids. These match ids form the pool of matches
that will be drawn from to display to the user. Unfortunately, you're on your
own getting these exact match ids as Riot prohibits redistribution of their
data. Either update the .matches file with the list of known matches or set
DATABASE_URL to the URL of a postgresql database containing the matches
according to the schema specified in utilities/database.schema

Once the API key and match ids are accounted for, the hard part is over. Simply
run

   > npm install

followed by

   > npm start

in the root directory of the project to launch the application.


Note: Git may insist that .apikey or .matches has changed despite it being in the
.gitignore file once a developer key has been added. If it does, run the commands

   > git update-index --assume-unchanged .apikey
   
   > git update-index --assume-unchanged .matches


in order to force git to ignore the file.

About the AI
------------

The default AI currently generated is...well...decently accurate, standing at
~56.5% of correct guessing the outcome of a match. The learning algorithm used
is called a Support Vector Maching (SVM). This [guide](http://www.csie.ntu.edu.tw/~cjlin/papers/guide/guide.pdf)
was very helpful in learning, at a high level, how to go about training an
SVM on a dataset.

The model currently posted was drawn from a data set of 20,000 matches
and took 3-4 hours to train on my Intel i7-4770k. Another training set was
used with a data set of 50,000 matches and took ~20 hours to train. The accuracy
improvement was about 1%, and the result model was 220mb size (too large for
GitHub). At the end of the day, an SVM was likely not the best algorithm to use
for this task. It was a fun experiment and a good deal about machine learning
and provided machine-friendly datasets was learned int he process.
