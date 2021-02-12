# coffee-time-alexa-skill
 An Alexa skill for the coffee lover
## In this Alexa skill, two features are (currently demonstrated) - a random fact vendor and a brew recipe skill.

### Random Fact Vendor
This feature allows the user to choose a subject, in this case between coffee and espresso.

The feature is built out using Amazon S3 (storage), Amazon Lambda (middleware and parsing), and APIGateway (API connection to Alexa Skills code) to retrieve the random fact and send it back to Alexa.

As of now, there are only 2 subjects. However, with a quick editing of the `facts_espresso_coffee.json` and some minor updates to the Alexa Skill, an "unlimited" number of subjects can be added to the random fact vending feature.

### Brew Recipe Skill
This feature asks the user to pick between 3 different Hario v60 brew recipes. These recipes are from my fascination with coffee and should be used as advice. I am no coffee expert (yet).

The feature follows a similar structure to the **random fact vendor** as I modified the Cloudformation template to create an identical stack except now for brew recipes.

These recipes are in a JSON format with some speech synthesis markup language (SSML) tags included to help the user follow the recipe. This part of the code is currently under construction and will be updated shortly. I plan to add some timer functionality and countdowns to help the user keep focused on brewing.
