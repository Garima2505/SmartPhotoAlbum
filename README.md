Implemented a photo album web application, that can be searched using natural language through both text and voice. Created an intelligent search layer to query your photos for people, objects, actions, landmarks and more.

### AWS Services Used
S3, Lex, ElasticSearch, Rekognition, Lambda function, CodePipeline,  CloudFormation and API Gateway

### Architecture
![image1](/Images/architecture.jpg)

### Implementation

1. Launch an ElasticSearch instance1 using AWS ElasticSearch service , create a new domain called “photos”.

2. Upload & index photos
  <ul>
    <li>* Create a S3 bucket (B2) to store the photos.</li>
    <li>* Create a Lambda function (LF1) called “index-photos”.</li>
    <li>* Set up a PUT event trigger on the photos S3 bucket (B2), such that whenever a photo gets uploaded to the bucket, it triggers the Lambda function (LF1) to index it.</li>
    <li>* Implement the indexing Lambda function (LF1):
    <ul>
      <li> Given a S3 PUT event (E1) detect labels in the image, using Rekognition (“detectLabels” method). </li>
      <li> Store a JSON object in an ElasticSearch index (“photos”) that references the S3 object from the PUT event (E1) and an array of string labels, one for each label detected by Rekognition. </li>
   </ul>
   </li>
  </ul>
Use the following schema for the JSON object: <br>
  &nbsp;{ <br>
   &nbsp; &nbsp; “objectKey”: “my-photo.jpg”, <br>
   &nbsp; &nbsp; “bucket”: “my-photo-bucket”, <br>
   &nbsp; &nbsp; “createdTimestamp”: “2018-11-05T12:40:02”,<br>
   &nbsp; &nbsp; “labels”: [<br>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; “person”, <br>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; “dog”, <br>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; “ball”, <br>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; “park” <br>
   &nbsp; &nbsp;         ] <br>
  &nbsp; } <br>

3. Search
  * Create a Lambda function (LF2) called “search-photos”.
  * Create an Amazon Lex bot to handle search queries.
    - Create one intent named “SearchIntent”.
    - Add training utterances to the intent, such that the bot can pick up both keyword searches (“trees”, “birds”), as well as sentence searches (“show me trees”, “show me photos with trees and birds in them”).

  * Implement the Search Lambda function (LF2):
    - Given a search query “q”, disambiguate the query using the Amazon Lex bot.
    _ If the Lex disambiguation request yields any keywords (K1, …, Kn),
search the “photos” ElasticSearch index for results, and return them accordingly (as per the API spec).
    - Otherwise, return an empty array of results (as per the API spec).
    
 4. [Frontend](https://github.com/Garima2505/VoiceSearchPhotoAlbum-Frontend)
  * Build a simple frontend application that allows users to:
      - Make search requests to the GET /search endpoint
      - Display the results (photos) resulting from the query
      - Upload new photos using the PUT /photos <br>
  * Create a S3 bucket for your frontend (B1).
  * Set up the bucket for static website hosting (same as HW1).
  * Upload the frontend files to the bucket (B2).
  * Integrate the API Gateway-generated SDK (SDK1) into the frontend, to connect your API.

5. Deploy your code using AWS CodePipeline
6. Create a AWS CloudFormation template for the stack


